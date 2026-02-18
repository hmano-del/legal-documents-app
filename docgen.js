// Document Generation using docx.js

async function generateDocument(docType, data) {
    const generators = {
        'certified-copy': generateCertifiedCopy,
        'vakalatnama': generateVakalatnama,
        'new-petition': generateNewPetition
    };
    
    const generator = generators[docType];
    if (!generator) {
        throw new Error('Invalid document type');
    }
    
    return await generator(data);
}

async function generateCertifiedCopy(data) {
    const { Document, Paragraph, TextRun, AlignmentType, TabStopPosition, TabStopType, convertInchesToTwip } = docx;
    
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1.2),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(2)
                    }
                }
            },
            children: [
                // Court Name
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: (data.Court || '').toUpperCase(),
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                // Case Number
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: `Case No. ${data.CaseNo || ''}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                // Parties
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${data.Plaintiff || ''}\t\t…Petitioner`,
                            size: 24
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX
                        }
                    ]
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: 'VERSUS',
                            size: 24
                        })
                    ],
                    spacing: { before: 100, after: 100 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${data.Defendant || ''}\t\t…Respondent`,
                            size: 24
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX
                        }
                    ],
                    spacing: { after: 300 }
                }),
                
                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: 'APPLICATION FOR CERTIFIED COPY',
                            bold: true,
                            underline: {},
                            size: 24
                        })
                    ],
                    spacing: { before: 300, after: 300 }
                }),
                
                // Salutation
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'The Applicant above named most respectfully submits as under:',
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                // Paragraphs
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `1.\tThat the Applicant is the Petitioner in the ${data.SuitType || ''} bearing Case No. ${data.CaseNo || ''} of ${data.Year || ''} pending before this Hon'ble Court.`,
                            size: 24
                        })
                    ],
                    spacing: { after: 150 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `2.\tThat the Applicant requires a certified copy of the following document(s):`,
                            size: 24
                        })
                    ],
                    spacing: { after: 100 }
                }),
                
                // Documents list
                ...(data.Docs || []).map(doc => 
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `\t• ${doc}`,
                                size: 24
                            })
                        ],
                        spacing: { after: 50 }
                    })
                ),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `3.\tThat the Applicant prays that this Hon'ble Court may be pleased to issue the certified copy/copies of the aforesaid document(s) to the Applicant at the earliest.`,
                            size: 24
                        })
                    ],
                    spacing: { before: 150, after: 300 }
                }),
                
                // Signature block
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Place: ${data.Place || ''}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Date: ${data.Date || new Date().toLocaleDateString()}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 150 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: data.Applicant || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: data.Mobile || '',
                            size: 24
                        })
                    ]
                })
            ]
        }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Certified_Copy_${data.Applicant || 'Application'}.docx`);
}

async function generateVakalatnama(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip } = docx;
    
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1.5)
                    }
                }
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: (data.Court || '').toUpperCase(),
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: 'VAKALATNAMA',
                            bold: true,
                            underline: {},
                            size: 28
                        })
                    ],
                    spacing: { before: 200, after: 300 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `I, ${data.Client || ''}, son/daughter of ${data.ClientFather || ''}, residing at ${data.ClientAddress || ''}, do hereby appoint and authorize ${data.Advocate || ''}, Advocate, practicing at ${data.AdvocateAddress || ''}, to appear, act and plead for me in Case No. ${data.CaseNo || ''} pending before the ${data.Court || ''}.`,
                            size: 24
                        })
                    ],
                    spacing: { after: 200 },
                    alignment: AlignmentType.JUSTIFIED
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'I hereby authorize the said Advocate to file, sign and verify all applications, petitions, affidavits and other documents, to appear and conduct the case on my behalf, to compromise, withdraw or otherwise deal with the case as may be deemed fit, and to do all other acts, deeds and things necessary for the proper conduct of the case.',
                            size: 24
                        })
                    ],
                    spacing: { after: 300 },
                    alignment: AlignmentType.JUSTIFIED
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Place: ${data.Place || ''}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Date: ${data.Date || new Date().toLocaleDateString()}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: data.Client || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: '(Client)',
                            size: 20
                        })
                    ]
                }),
                
                new Paragraph({
                    spacing: { before: 300, after: 100 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Accepted:',
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: data.Advocate || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: '(Advocate)',
                            size: 20
                        })
                    ]
                })
            ]
        }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Vakalatnama_${data.Client || 'Document'}.docx`);
}

async function generateNewPetition(data) {
    const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip } = docx;
    
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1.2),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(2)
                    }
                }
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: (data.Court || '').toUpperCase(),
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: data.PetitionType || 'PETITION',
                            bold: true,
                            underline: {},
                            size: 26
                        })
                    ],
                    spacing: { after: 100 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: data.Subject || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${data.Petitioner || ''}\t\t…Petitioner`,
                            size: 24
                        })
                    ],
                    spacing: { after: 100 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: 'VERSUS',
                            size: 24
                        })
                    ],
                    spacing: { before: 100, after: 100 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${data.Respondent || ''}\t\t…Respondent`,
                            size: 24
                        })
                    ],
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'The Petitioner above named most respectfully submits as under:',
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'BRIEF FACTS',
                            bold: true,
                            underline: {},
                            size: 24
                        })
                    ],
                    spacing: { after: 150 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: data.Facts || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 200 },
                    alignment: AlignmentType.JUSTIFIED
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'GROUNDS',
                            bold: true,
                            underline: {},
                            size: 24
                        })
                    ],
                    spacing: { after: 150 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: data.Grounds || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 200 },
                    alignment: AlignmentType.JUSTIFIED
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'PRAYER',
                            bold: true,
                            underline: {},
                            size: 24
                        })
                    ],
                    spacing: { after: 150 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `In light of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to: ${data.Relief || ''}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 300 },
                    alignment: AlignmentType.JUSTIFIED
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Place: ${data.Place || ''}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Date: ${data.Date || new Date().toLocaleDateString()}`,
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: data.Petitioner || '',
                            size: 24
                        })
                    ],
                    spacing: { after: 50 }
                }),
                
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: '(Petitioner)',
                            size: 20
                        })
                    ]
                })
            ]
        }]
    });
    
    const blob = await docx.Packer.toBlob(doc);
    downloadBlob(blob, `Petition_${data.Petitioner || 'Document'}.docx`);
}

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
