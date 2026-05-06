require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const supabase = require('./db');

const app = express();

// middlewares básicos
app.use(cors());
app.use(express.json());

// endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servicio funcionando');
});

// endpoint para generar contrato
app.post('/api/contratos', async (req, res) => {
    const { id_personal, fecha_inicio, salario, tiempo_prueba } = req.body;

    if (!id_personal || !fecha_inicio || !salario || !tiempo_prueba) {
        return res.status(400).json({ error: 'Faltan datos requeridos (id_personal, fecha_inicio, salario, tiempo_prueba)' });
    }

    try {
        // 1. Obtener datos del empleado desde la tabla personal
        const { data: empleado, error: empleadoError } = await supabase
            .from('personal')
            .select('*')
            .eq('id', id_personal)
            .single();

        if (empleadoError || !empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado en la base de datos' });
        }

        // 2. Generar PDF con pdfkit
        const doc = new PDFDocument({ margin: 50 });

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));

        doc.on('end', async () => {
            try {
                const pdfData = Buffer.concat(buffers);
                const base64Pdf = pdfData.toString('base64');

                // 3. Guardar en la tabla contratos (Base64 + datos)
                const { data: nuevoContrato, error: contratoError } = await supabase
                    .from('contratos')
                    .insert([{
                        id_personal,
                        fecha_inicio,
                        salario,
                        tiempo_prueba,
                        contenido: base64Pdf
                    }])
                    .select()
                    .single();

                if (contratoError) {
                    console.error("Error al guardar contrato:", contratoError);
                    if (!res.headersSent) {
                        return res.status(500).json({ error: 'Error al guardar el contrato en la base de datos' });
                    }
                }

                // 4. Responder con el PDF y cabeceras para descarga
                if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=contrato_${empleado.ci}.pdf`);
                    res.send(pdfData);
                }
            } catch (err) {
                console.error("Error al procesar el PDF o guardar:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error al finalizar la generación del contrato' });
                }
            }
        });

        // Contenido del PDF
        doc.fontSize(20).text('CONTRATO DE TRABAJO', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(12).text(`Conste por el presente documento, el CONTRATO DE TRABAJO que celebran, de una parte la EMPRESA y de la otra el TRABAJADOR, cuyos datos y condiciones se detallan a continuación:`, { align: 'justify' });
        doc.moveDown(1.5);

        doc.font('Helvetica-Bold').text('1. DATOS DEL TRABAJADOR:');
        doc.font('Helvetica').text(`Nombre Completo: ${empleado.nombre}`);
        doc.text(`Cédula de Identidad: ${empleado.ci}`);
        doc.text(`Cargo asignado: ${empleado.cargo}`);
        doc.text(`Área: ${empleado.area}`);
        doc.moveDown(1);

        doc.font('Helvetica-Bold').text('2. CONDICIONES DEL CONTRATO:');
        doc.font('Helvetica').text(`Fecha de Ingreso: ${fecha_inicio}`);
        doc.text(`Salario Mensual: ${salario} Bs.`);
        doc.text(`Tiempo de Prueba: ${tiempo_prueba}`);
        doc.moveDown(1);

        doc.font('Helvetica-Bold').text('3. DECLARACIÓN:');
        doc.font('Helvetica').text(`Ambas partes declaran su conformidad con las condiciones expuestas en el presente contrato, comprometiéndose a cumplir con las responsabilidades y obligaciones inherentes a la relación laboral, sujetas a lo establecido por las leyes vigentes.`, { align: 'justify' });
        doc.moveDown(4);

        // Firmas
        doc.text('_________________________________                                  _________________________________');
        doc.text('Firma del Empleador                                                                 Firma del Trabajador');

        // Finalizar el documento
        doc.end();

    } catch (error) {
        console.error("Error en el servidor:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servicio corriendo en puerto ${PORT}`);
});