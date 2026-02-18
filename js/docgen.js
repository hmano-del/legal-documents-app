// Document Generation using docx.js

async function generateDocument(docType, data) {
    const generators = {
        'certified-copy': generateCertifiedCopy,
        'vakalatnama': generateVakalatnama,
        'new-petition': generateNewPetition
    };
    const generator = generators[docType];
    if (!generator) throw new Error('Invalid document type');
    return await generator(data);
}

// ─────────────────────── CERTIFIED COPY ───────────────────────
async function generateCertifiedCopy(data) {
    const { Document, Paragraph, TextRun, AlignmentType, TabStopPosition, TabStopType, convertInchesToTwip, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    function partyTable(leftText, rightText) {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
            rows: [new TableRow({ children: [
                new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, borders: noBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: leftText, size: 28, font: 'Times New Roman' })] })] }),
                new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: noBorders,
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: rightText, size: 28, font: 'Times New Roman' })] })] }),
            ]})]
        });
    }

    const children = [
        // Court
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: (data.Court || '').toUpperCase(), bold: true, size: 28, font: 'Times New Roman' })],
            spacing: { after: 240 }
        }),
        // Case No
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: `Case No. ${data.CaseNo || ''}`, size: 28, font: 'Times New Roman' })],
            spacing: { after: 200 }
        }),
        // Plaintiff row
        partyTable(`${data.P_Title || ''} ${data.Plaintiff || ''}`, `…${data.PRole || 'Petitioner'}`),
        // VERSUS
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'VERSUS', size: 28, font: 'Times New Roman' })],
            spacing: { before: 120, after: 120 }
        }),
        // Defendant row
        partyTable(`${data.D_Title || ''} ${data.Defendant || ''}`, `…${data.DRole || 'Respondent'}`),
        // Title
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'APPLICATION FOR CERTIFIED COPY', bold: true, underline: {}, size: 28, font: 'Times New Roman' })],
            spacing: { before: 480, after: 480 }
        }),
        // Salutation
        new Paragraph({
            children: [new TextRun({ text: "The Applicant above named most respectfully submits as under:", size: 28, font: 'Times New Roman' })],
            spacing: { after: 240 }
        }),
        // Para 1
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({
                text: `1.\tThat the Applicant is the ${data.ApplicantType || 'Petitioner'} in the ${data.SuitType || 'Civil Suit'} bearing Case No. ${data.CaseNo || ''} of ${data.Year || ''} ${data.SuitStatus || 'pending'} before this Hon'ble Court.`,
                size: 28, font: 'Times New Roman'
            })],
            spacing: { after: 200 }
        }),
        // Para 2
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({
                text: `2.\tThat the said ${data.SuitType || 'Civil Suit'} was filed by ${data.P_Title || ''} ${data.Plaintiff || ''} against ${data.D_Title || ''} ${data.Defendant || ''} for legal relief.`,
                size: 28, font: 'Times New Roman'
            })],
            spacing: { after: 200 }
        }),
        // Para 3
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: '3.\tThat the Applicant requires a certified copy of the following document(s):', size: 28, font: 'Times New Roman' })],
            spacing: { after: 100 }
        }),
        // Doc list
        ...(data.Docs || []).map(d => new Paragraph({
            children: [new TextRun({ text: `\t• ${d}`, size: 28, font: 'Times New Roman' })],
            spacing: { after: 80 }
        })),
        // Para 4
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({
                text: "4.\tThat the Applicant prays that this Hon'ble Court may be pleased to issue the certified copy/copies of the aforesaid document(s) to the Applicant at the earliest.",
                size: 28, font: 'Times New Roman'
            })],
            spacing: { before: 200, after: 400 }
        }),
        // Place & Date
        new Paragraph({ children: [new TextRun({ text: `Place: ${data.Place || 'Margao'}`, size: 28, font: 'Times New Roman' })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: `Date: ${data.Date || ''}`, size: 28, font: 'Times New Roman' })], spacing: { after: 240 } }),
        // Applicant (right)
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.Applicant || '', size: 28, font: 'Times New Roman' })], spacing: { after: 80 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.Mobile || '', size: 28, font: 'Times New Roman' })] }),
    ];

    const doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1.2), right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1), left: convertInchesToTwip(2)
        }}}, children }]
    });

    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Certified_Copy_${(data.Applicant || 'Application').replace(/\s+/g,'_')}.docx`);
}

// ─────────────────────── VAKALATNAMA ───────────────────────
async function generateVakalatnama(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    function partyTable(leftText, rightText) {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
            rows: [new TableRow({ children: [
                new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, borders: noBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: leftText, size: 24, font: 'Times New Roman' })] })] }),
                new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: noBorders,
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: rightText, size: 24, font: 'Times New Roman' })] })] }),
            ]})]
        });
    }

    const iw = data.AppointmentType || 'I';
    const isSing = iw === 'I';
    const my = isSing ? 'my' : 'our';

    const advocates = data.Advocates || [];
    const extraCount = data.ExtraExecutants || 0;
    const extraNames = data.ExtraExecutantNames || [];

    // Signature table rows
    const totalRows = Math.max(advocates.length, 1 + extraCount);
    const sigRows = [];
    sigRows.push(new TableRow({ children: [
        new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noBorders,
            children: [new Paragraph({ children: [new TextRun({ text: 'Accepted:', size: 24, font: 'Times New Roman' })] })] }),
        new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noBorders,
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executant(s):', size: 24, font: 'Times New Roman' })] })] }),
    ]}));
    for (let i = 0; i < totalRows; i++) {
        const advName = i < advocates.length ? advocates[i] : '';
        let execName = '';
        if (i === 0) execName = data.ApplicantName || '';
        else if (i <= extraCount) execName = extraNames[i-1] || `Executant ${i+1}`;
        sigRows.push(new TableRow({ children: [
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noBorders,
                children: [new Paragraph({ children: [new TextRun({ text: advName ? `\n\n_____________________\n${advName}` : '', size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noBorders,
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: execName ? `\n\n_____________________\n${execName}` : '', size: 24, font: 'Times New Roman' })] })] }),
        ]}));
    }

    const children = [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VAKALATNAMA', bold: true, size: 32, font: 'Times New Roman' })], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (data.Court || '').toUpperCase(), bold: true, size: 24, font: 'Times New Roman' })], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Case No. ${data.CaseNo || ''}`, size: 24, font: 'Times New Roman' })], spacing: { after: 200 } }),
        partyTable(`${data.P_Title || ''} ${data.Petitioner || ''}`, `…${data.PRole || 'Petitioner'}`),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VERSUS', size: 24, font: 'Times New Roman' })], spacing: { before: 120, after: 120 } }),
        partyTable(`${data.D_Title || ''} ${data.Defendant || ''}`, `…${data.DRole || 'Respondent'}`),
        new Paragraph({ spacing: { after: 200 } }),
        // Body
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
                new TextRun({ text: `${iw}, `, size: 24, font: 'Times New Roman' }),
                new TextRun({ text: data.ApplicantName || '', bold: true, size: 24, font: 'Times New Roman' }),
                new TextRun({ text: `, residing at ${data.Address || ''}, do hereby appoint and retain:`, size: 24, font: 'Times New Roman' }),
            ],
            spacing: { after: 200 }
        }),
        // Advocate bullets
        ...advocates.map(adv => new Paragraph({
            children: [new TextRun({ text: `• ${adv}`, size: 24, font: 'Times New Roman' })],
            spacing: { after: 80 }
        })),
        // Authority text
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({
                text: `as ${my} Advocate(s) to appear, act, plead and conduct the above case on ${my} behalf and to do all lawful acts, deeds and things as may be necessary for the prosecution/defense of the said case.`,
                size: 24, font: 'Times New Roman'
            })],
            spacing: { before: 200, after: 300 }
        }),
        // Witness line
        new Paragraph({
            children: [
                new TextRun({ text: `IN WITNESS WHEREOF, ${isSing ? 'I' : 'We'} have set ${my} hand(s) on this `, size: 24, font: 'Times New Roman' }),
                new TextRun({ text: data.WitnessDate || '', bold: true, size: 24, font: 'Times New Roman' }),
            ],
            spacing: { after: 400 }
        }),
        // Signature table
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
            rows: sigRows
        }),
    ];

    const doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1), right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.6)
        }}}, children }]
    });

    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Vakalatnama_${(data.ApplicantName || 'Document').replace(/\s+/g,'_')}.docx`);
}

// ─────────────────────── NEW PETITION ───────────────────────
async function generateNewPetition(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } = docx;

    const solidBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
    const solidBorders = { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder };
    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    function txt(text, opts = {}) {
        return new TextRun({ text, size: opts.size || 28, font: 'Times New Roman', bold: opts.bold || false, italic: opts.italic || false, underline: opts.underline ? {} : undefined });
    }

    function personTable(person, label) {
        const rows = [
            [`${person.title} ${person.name}`, ''],
            [`${person.parent_relation} ${person.parent_name}`, ''],
            [`Aged about ${person.age} years`, ''],
            [person.occupation, ''],
            [`Resident of: ${person.address}`, label],
        ];
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder, insideH: solidBorder, insideV: solidBorder },
            rows: rows.map(([c1, c2]) => new TableRow({ children: [
                new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, borders: solidBorders,
                    children: [new Paragraph({ children: [txt(c1)] })] }),
                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: solidBorders,
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt(c2)] })] }),
            ]}))
        });
    }

    const petitioners = data.petitioners || [];
    const defendants = data.defendants || [];
    const np = petitioners.length;
    const nd = defendants.length;

    const children = [
        // Court
        new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(data.court || '', { bold: true })], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt(`Case No. ${data.case_no || ''}`)], spacing: { after: 200 } }),
        new Paragraph({ spacing: { after: 100 } }),
    ];

    // Petitioner tables
    petitioners.forEach((pet, idx) => {
        const lbl = np > 1 ? `... Petitioner No. ${idx+1}` : '... Petitioner';
        children.push(personTable(pet, lbl));
        children.push(new Paragraph({ spacing: { after: 200 } }));
    });

    // VERSUS
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [txt('Versus', { bold: true, italic: true })], spacing: { before: 200, after: 200 } }));

    // Defendant tables
    defendants.forEach((def, idx) => {
        const lbl = nd > 1 ? `... Defendant No. ${idx+1}` : '... Defendant';
        children.push(personTable(def, lbl));
        children.push(new Paragraph({ spacing: { after: 200 } }));
    });

    // Registered addresses note
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [txt('(The Above are registered addresses of the parties)', { bold: true, italic: true })], spacing: { after: 400 } }));

    // Preamble
    children.push(new Paragraph({ children: [txt('May it please your lordships:')], spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [txt('The petitioners submit as under')], spacing: { after: 200 } }));

    // Petition text
    children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [txt(data.petition_text || '')], spacing: { after: 400 } }));

    // Place & Date
    children.push(new Paragraph({ children: [txt(`Place: ${data.place || 'Margao'}`)], spacing: { after: 80 } }));
    children.push(new Paragraph({ children: [txt(`Date: ${data.date || ''}`)], spacing: { after: 400 } }));

    // Petitioner signature
    children.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt('Petitioner no.1')], spacing: { after: 200 } }));

    // Page break → Verification
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [txt('VERIFICATION', { bold: true })], spacing: { after: 200 } }));

    if (petitioners.length > 0) {
        const fp = petitioners[0];
        const verTxt = `I ${fp.title} ${fp.name}, ${fp.parent_relation} ${fp.parent_name}, aged about ${fp.age} years, resident of ${fp.address}, solemnly verify that the contents of the above petition are true to the best of my knowledge.`;
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [txt(verTxt)], spacing: { after: 200 } }));

        let solemn = `Solemnly verified at ${data.place || 'Margao'} on this date.`;
        try {
            const [d,m,y] = (data.date || '').split('/');
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            solemn = `Solemnly verified at ${data.place || 'Margao'} on this ${parseInt(d)} day of the month of ${months[parseInt(m)-1]} ${y}.`;
        } catch(e) {}
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [txt(solemn)], spacing: { after: 400 } }));
    }

    // Identified by / Deponent
    children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
        rows: [new TableRow({ children: [
            new TableCell({ borders: noBorders, children: [new Paragraph({ children: [txt('Identified by')] })] }),
            new TableCell({ borders: noBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt('Deponent')] })] }),
        ]})]
    }));

    // Page break → Affidavit
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [txt('AFFIDAVIT', { bold: true })], spacing: { after: 200 } }));

    if (petitioners.length > 0) {
        const fp = petitioners[0];
        const affTxt = `I ${fp.title} ${fp.name}, ${fp.parent_relation} ${fp.parent_name}, aged about ${fp.age} years, resident of ${fp.address}, state on solemn affirmation that the contents of the above paras are true to my knowledge.`;
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [txt(affTxt)], spacing: { after: 200 } }));

        let solemn = `Solemnly verified at ${data.place || 'Margao'} on this date.`;
        try {
            const [d,m,y] = (data.date || '').split('/');
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            solemn = `Solemnly verified at ${data.place || 'Margao'} on this ${parseInt(d)} day of the month of ${months[parseInt(m)-1]} ${y}.`;
        } catch(e) {}
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [txt(solemn)], spacing: { after: 400 } }));
    }

    children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
        rows: [new TableRow({ children: [
            new TableCell({ borders: noBorders, children: [new Paragraph({ children: [txt('Identified by')] })] }),
            new TableCell({ borders: noBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt('Deponent')] })] }),
        ]})]
    }));

    const doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1.2), left: convertInchesToTwip(2)
        }}}, children }]
    });

    const ts = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Petition_${(data.case_no || 'Document').replace(/\//g,'_')}_${ts}.docx`);
}

// ─────────────────────── DOWNLOAD ───────────────────────
function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
