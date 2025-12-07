const { mdToPdf } = require('md-to-pdf');
const path = require('path');

async function generatePDF() {
  const mdFile = path.join(__dirname, 'PRESENTATION_COMPLETE.md');
  const pdfFile = path.join(__dirname, 'IPRD_ERP_Presentation_Guide.pdf');

  console.log('📄 Generating PDF from Markdown...\n');

  try {
    const pdf = await mdToPdf(
      { path: mdFile },
      {
        dest: pdfFile,
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
          },
          printBackground: true
        }
      }
    );

    if (pdf) {
      console.log('✅ PDF generated successfully!');
      console.log(`📁 Location: ${pdfFile}\n`);
      return pdf;
    } else {
      console.log('❌ PDF generation failed');
    }
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    throw error;
  }
}

generatePDF().catch(console.error);


