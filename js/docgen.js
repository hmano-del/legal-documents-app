// Document Generation using docx.js (v7.x)
// docx is loaded globally from CDN as window.docx

function getDocx() {
    const d = window.docx;
    if (!d) throw new Error('docx library not loaded. Please check your internet connection and reload the page.');
    return d;
}

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
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip,
            Table, TableRow, TableCell, WidthType, BorderStyle } = getDocx();

    const NIL = (BorderStyle.NIL !== undefined) ? BorderStyle.NIL : ((BorderStyle.NONE !== undefined) ? BorderStyle.NONE : 'nil');
    const noBorder = { style: NIL, size: 0, color: 'FFFFFF' };
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
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: (data.Court || '').toUpperCase(), bold: true, size: 28, font: 'Times New Roman' })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'Case No. ' + (data.CaseNo || ''), size: 28, font: 'Times New Roman' })],
            spacing: { after: 200 }
        }),
        partyTable((data.P_Title || '') + ' ' + (data.Plaintiff || ''), '\u2026' + (data.PRole || 'Petitioner')),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'VERSUS', size: 28, font: 'Times New Roman' })],
            spacing: { before: 120, after: 120 }
        }),
        partyTable((data.D_Title || '') + ' ' + (data.Defendant || ''), '\u2026' + (data.DRole || 'Respondent')),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'APPLICATION FOR CERTIFIED COPY', bold: true, underline: {}, size: 28, font: 'Times New Roman' })],
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ text: 'The Applicant above named most respectfully submits as under:', size: 28, font: 'Times New Roman' })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: '1.\tThat the Applicant is the ' + (data.ApplicantType || 'Petitioner') + ' in the ' + (data.SuitType || 'Civil Suit') + ' bearing Case No. ' + (data.CaseNo || '') + ' of ' + (data.Year || '') + ' ' + (data.SuitStatus || 'pending') + ' before this Hon\u2019ble Court.', size: 28, font: 'Times New Roman' })],
            spacing: { after: 200 }
        }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: '2.\tThat the said ' + (data.SuitType || 'Civil Suit') + ' was filed by ' + (data.P_Title || '') + ' ' + (data.Plaintiff || '') + ' against ' + (data.D_Title || '') + ' ' + (data.Defendant || '') + ' for legal relief.', size: 28, font: 'Times New Roman' })],
            spacing: { after: 200 }
        }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: '3.\tThat the Applicant requires a certified copy of the following document(s):', size: 28, font: 'Times New Roman' })],
            spacing: { after: 100 }
        }),
    ];

    (data.Docs || []).forEach(function(d) {
        children.push(new Paragraph({
            children: [new TextRun({ text: '\t\u2022 ' + d, size: 28, font: 'Times New Roman' })],
            spacing: { after: 80 }
        }));
    });

    children.push(
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: '4.\tThat the Applicant prays that this Hon\u2019ble Court may be pleased to issue the certified copy/copies of the aforesaid document(s) to the Applicant at the earliest.', size: 28, font: 'Times New Roman' })],
            spacing: { before: 200, after: 400 }
        }),
        new Paragraph({ children: [new TextRun({ text: 'Place: ' + (data.Place || 'Margao'), size: 28, font: 'Times New Roman' })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: 'Date: ' + (data.Date || ''), size: 28, font: 'Times New Roman' })], spacing: { after: 240 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.Applicant || '', size: 28, font: 'Times New Roman' })], spacing: { after: 80 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.Mobile || '', size: 28, font: 'Times New Roman' })] })
    );

    const doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1.2), right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1), left: convertInchesToTwip(2)
        }}}, children: children }]
    });

    const blob = await window.docx.Packer.toBlob(doc);
    downloadBlob(blob, 'Certified_Copy_' + (data.Applicant || 'Application').replace(/\s+/g, '_') + '.docx');
}

// ─────────────────────── VAKALATNAMA ───────────────────────
async function generateVakalatnama(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip,
            Table, TableRow, TableCell, WidthType, BorderStyle } = getDocx();

    const NIL = (BorderStyle.NIL !== undefined) ? BorderStyle.NIL : ((BorderStyle.NONE !== undefined) ? BorderStyle.NONE : 'nil');
    const noBorder = { style: NIL, size: 0, color: 'FFFFFF' };
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

    var iw = data.AppointmentType || 'I';
    var isSing = iw === 'I';
    var my = isSing ? 'my' : 'our';
    var advocates = data.Advocates || [];
    var extraCount = data.ExtraExecutants || 0;
    var extraNames = data.ExtraExecutantNames || [];
    var totalRows = Math.max(advocates.length, 1 + extraCount);

    var sigRows = [
        new TableRow({ children: [
            new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Accepted:', size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: noBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executant(s):', size: 24, font: 'Times New Roman' })] })] }),
        ]})
    ];
    for (var i = 0; i < totalRows; i++) {
        var advName = i < advocates.length ? advocates[i] : '';
        var execName = i === 0 ? (data.ApplicantName || '') : (i <= extraCount ? (extraNames[i-1] || ('Executant ' + (i+1))) : '');
        sigRows.push(new TableRow({ children: [
            new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: advName ? ('\n\n_____________________\n' + advName) : '', size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: noBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: execName ? ('\n\n_____________________\n' + execName) : '', size: 24, font: 'Times New Roman' })] })] }),
        ]}));
    }

    var children = [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VAKALATNAMA', bold: true, size: 32, font: 'Times New Roman' })], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (data.Court || '').toUpperCase(), bold: true, size: 24, font: 'Times New Roman' })], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Case No. ' + (data.CaseNo || ''), size: 24, font: 'Times New Roman' })], spacing: { after: 200 } }),
        partyTable((data.P_Title || '') + ' ' + (data.Petitioner || ''), '\u2026' + (data.PRole || 'Petitioner')),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VERSUS', size: 24, font: 'Times New Roman' })], spacing: { before: 120, after: 120 } }),
        partyTable((data.D_Title || '') + ' ' + (data.Defendant || ''), '\u2026' + (data.DRole || 'Respondent')),
        new Paragraph({ spacing: { after: 200 } }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
                new TextRun({ text: iw + ', ', size: 24, font: 'Times New Roman' }),
                new TextRun({ text: data.ApplicantName || '', bold: true, size: 24, font: 'Times New Roman' }),
                new TextRun({ text: ', residing at ' + (data.Address || '') + ', do hereby appoint and retain:', size: 24, font: 'Times New Roman' }),
            ],
            spacing: { after: 200 }
        }),
    ];

    advocates.forEach(function(adv) {
        children.push(new Paragraph({ children: [new TextRun({ text: '\u2022 ' + adv, size: 24, font: 'Times New Roman' })], spacing: { after: 80 } }));
    });

    children.push(
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: 'as ' + my + ' Advocate(s) to appear, act, plead and conduct the above case on ' + my + ' behalf and to do all lawful acts, deeds and things as may be necessary for the prosecution/defense of the said case.', size: 24, font: 'Times New Roman' })],
            spacing: { before: 200, after: 300 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'IN WITNESS WHEREOF, ' + (isSing ? 'I' : 'We') + ' have set ' + my + ' hand(s) on this ', size: 24, font: 'Times New Roman' }),
                new TextRun({ text: data.WitnessDate || '', bold: true, size: 24, font: 'Times New Roman' }),
            ],
            spacing: { after: 400 }
        }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
            rows: sigRows
        })
    );

    var doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1), right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.6)
        }}}, children: children }]
    });

    var blob = await window.docx.Packer.toBlob(doc);
    downloadBlob(blob, 'Vakalatnama_' + (data.ApplicantName || 'Document').replace(/\s+/g, '_') + '.docx');
}

// ─────────────────────── NEW PETITION ───────────────────────
async function generateNewPetition(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip,
            Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } = getDocx();

    const NIL = (BorderStyle.NIL !== undefined) ? BorderStyle.NIL : ((BorderStyle.NONE !== undefined) ? BorderStyle.NONE : 'nil');
    var solidBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
    var solidBorders = { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder };
    var noBorder = { style: NIL, size: 0, color: 'FFFFFF' };
    var noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    function tx(text, bold, italic) {
        return new TextRun({ text: text, size: 28, font: 'Times New Roman', bold: !!bold, italic: !!italic });
    }

    function personTable(person, label) {
        var rows = [
            [(person.title || '') + ' ' + (person.name || ''), ''],
            [(person.parent_relation || '') + ' ' + (person.parent_name || ''), ''],
            ['Aged about ' + (person.age || '') + ' years', ''],
            [person.occupation || '', ''],
            ['Resident of: ' + (person.address || ''), label],
        ];
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder, insideH: solidBorder, insideV: solidBorder },
            rows: rows.map(function(r) {
                return new TableRow({ children: [
                    new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, borders: solidBorders, children: [new Paragraph({ children: [tx(r[0])] })] }),
                    new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: solidBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [tx(r[1])] })] }),
                ]});
            })
        });
    }

    var petitioners = data.petitioners || [];
    var defendants = data.defendants || [];

    var children = [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [tx(data.court || '', true)], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [tx('Case No. ' + (data.case_no || ''))], spacing: { after: 200 } }),
        new Paragraph({ spacing: { after: 100 } }),
    ];

    petitioners.forEach(function(pet, idx) {
        var lbl = petitioners.length > 1 ? ('... Petitioner No. ' + (idx+1)) : '... Petitioner';
        children.push(personTable(pet, lbl));
        children.push(new Paragraph({ spacing: { after: 200 } }));
    });

    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [tx('Versus', true, true)], spacing: { before: 200, after: 200 } }));

    defendants.forEach(function(def, idx) {
        var lbl = defendants.length > 1 ? ('... Defendant No. ' + (idx+1)) : '... Defendant';
        children.push(personTable(def, lbl));
        children.push(new Paragraph({ spacing: { after: 200 } }));
    });

    children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, children: [tx('(The Above are registered addresses of the parties)', true, true)], spacing: { after: 400 } }),
        new Paragraph({ children: [tx('May it please your lordships:')], spacing: { after: 100 } }),
        new Paragraph({ children: [tx('The petitioners submit as under')], spacing: { after: 200 } }),
        new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [tx(data.petition_text || '')], spacing: { after: 400 } }),
        new Paragraph({ children: [tx('Place: ' + (data.place || 'Margao'))], spacing: { after: 80 } }),
        new Paragraph({ children: [tx('Date: ' + (data.date || ''))], spacing: { after: 400 } }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [tx('Petitioner no.1')], spacing: { after: 200 } }),
        new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [tx('VERIFICATION', true)], spacing: { after: 200 } })
    );

    if (petitioners.length > 0) {
        var fp = petitioners[0];
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [tx('I ' + (fp.title||'') + ' ' + (fp.name||'') + ', ' + (fp.parent_relation||'') + ' ' + (fp.parent_name||'') + ', aged about ' + (fp.age||'') + ' years, resident of ' + (fp.address||'') + ', solemnly verify that the contents of the above petition are true to the best of my knowledge.')], spacing: { after: 200 } }));
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [tx(buildSolemnLine(data))], spacing: { after: 400 } }));
    }

    children.push(
        buildIdTable(noBorder, noBorders, Table, TableRow, TableCell, WidthType, Paragraph, TextRun, AlignmentType),
        new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [tx('AFFIDAVIT', true)], spacing: { after: 200 } })
    );

    if (petitioners.length > 0) {
        var fp2 = petitioners[0];
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [tx('I ' + (fp2.title||'') + ' ' + (fp2.name||'') + ', ' + (fp2.parent_relation||'') + ' ' + (fp2.parent_name||'') + ', aged about ' + (fp2.age||'') + ' years, resident of ' + (fp2.address||'') + ', state on solemn affirmation that the contents of the above paras are true to my knowledge.')], spacing: { after: 200 } }));
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [tx(buildSolemnLine(data))], spacing: { after: 400 } }));
    }

    children.push(buildIdTable(noBorder, noBorders, Table, TableRow, TableCell, WidthType, Paragraph, TextRun, AlignmentType));

    var doc = new Document({
        sections: [{ properties: { page: { margin: {
            top: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1.2), left: convertInchesToTwip(2)
        }}}, children: children }]
    });

    var ts = new Date().toISOString().slice(0,10).replace(/-/g,'');
    var blob = await window.docx.Packer.toBlob(doc);
    downloadBlob(blob, 'Petition_' + (data.case_no || 'Document').replace(/\//g,'_') + '_' + ts + '.docx');
}

function buildSolemnLine(data) {
    try {
        var parts = (data.date || '').split('/');
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return 'Solemnly verified at ' + (data.place || 'Margao') + ' on this ' + parseInt(parts[0]) + ' day of the month of ' + months[parseInt(parts[1])-1] + ' ' + parts[2] + '.';
    } catch(e) {
        return 'Solemnly verified at ' + (data.place || 'Margao') + ' on this date.';
    }
}

function buildIdTable(noBorder, noBorders, Table, TableRow, TableCell, WidthType, Paragraph, TextRun, AlignmentType) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
        rows: [new TableRow({ children: [
            new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Identified by', size: 28, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: noBorders, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Deponent', size: 28, font: 'Times New Roman' })] })] }),
        ]})]
    });
}

// ─────────────────────── DOWNLOAD ───────────────────────
function downloadBlob(blob, filename) {
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
