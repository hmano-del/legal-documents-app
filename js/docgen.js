// Document Generation — browser-native using JSZip (reliable CDN, no build step)
// JSZip is always available: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js

// ─── Helpers ─────────────────────────────────────────────────────────────────
function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const CM = v => Math.round(v * 360000);
const PT = v => Math.round(v * 12700);

function para({ text='', bold=false, underline=false, italic=false,
    align='left', size=24, spaceAfter=0, spaceBefore=0,
    indent=0, lineSpacing=null, runs=null } = {}) {

    const pPr = `<w:pPr>
      <w:jc w:val="${align==='justify'?'both':align}"/>
      ${(spaceAfter||spaceBefore)?`<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>`:''}
      ${indent?`<w:ind w:left="${CM(indent)}"/>`:''}
      ${lineSpacing?`<w:spacing w:line="${Math.round(lineSpacing*240)}" w:lineRule="auto" w:before="${spaceBefore}" w:after="${spaceAfter}"/>`:''}
    </w:pPr>`;

    const mkRun = (txt, b=bold, u=underline, i=italic, sz=size) => {
        if(!txt && txt!=='') return '';
        const lines = String(txt).split('\n');
        const content = lines.map((line,idx) =>
            (idx>0?'<w:br/>':'') + `<w:t xml:space="preserve">${esc(line)}</w:t>`
        ).join('');
        return `<w:r><w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>
          ${b?'<w:b/>':''}${u?'<w:u w:val="single"/>':''}${i?'<w:i/>':''}
        </w:rPr>${content}</w:r>`;
    };

    const rXml = runs
        ? runs.map(r=>mkRun(r.text,r.bold,r.underline,r.italic,r.size||size)).join('')
        : mkRun(text);
    return `<w:p>${pPr}${rXml}</w:p>`;
}

function cell(txt, rightAlign=false) {
    return `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>
    <w:p><w:pPr>${rightAlign?'<w:jc w:val="right"/>':''}</w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
    <w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
    ${String(txt).split('\n').map((l,i)=>(i>0?'<w:br/>':'')+`<w:t xml:space="preserve">${esc(l)}</w:t>`).join('')}
    </w:r></w:p></w:tc>`;
}

function tblBorders(show=false) {
    const val = show?'single':'none'; const sz=show?'4':'0';
    return ['top','left','bottom','right','insideH','insideV']
        .map(n=>`<w:${n} w:val="${val}" w:sz="${sz}" w:space="0" w:color="${show?'000000':'auto'}"/>`)
        .join('');
}

function tbl(rowsHtml, bordered=false) {
    return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>
      <w:tblBorders>${tblBorders(bordered)}</w:tblBorders>
    </w:tblPr>${rowsHtml}</w:tbl>`;
}
function row(...cells) { return `<w:tr>${cells.join('')}</w:tr>`; }
function pageBreak() { return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`; }

async function buildDocx(bodyXml, margins={}) {
    const m = {
        top:    margins.top    ?? CM(3),
        bottom: margins.bottom ?? CM(2.5),
        left:   margins.left   ?? CM(5),
        right:  margins.right  ?? CM(2.5),
    };
    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${bodyXml}
<w:sectPr>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="${m.top}" w:right="${m.right}" w:bottom="${m.bottom}" w:left="${m.left}" w:header="720" w:footer="720"/>
</w:sectPr></w:body></w:document>`;

    const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const zip = new JSZip();
    zip.file('[Content_Types].xml', contentTypes);
    zip.file('_rels/.rels', rootRels);
    zip.file('word/document.xml', docXml);
    return zip.generateAsync({
        type:'blob',
        mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href:url, download:filename});
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════
// CERTIFIED COPY
// ═══════════════════════════════════════════════════════════
async function generateCertifiedCopy(d) {
    const today = new Date().toLocaleDateString('en-IN');
    const docs = d.Docs || [];
    const body = [
        para({text:(d.Court||'').toUpperCase(), bold:true, align:'center', size:28, spaceAfter:200}),
        para({text:`Case No. ${d.CaseNo||''}`, align:'right', spaceBefore:120}),
        tbl(row(cell(`${d.Plaintiff||''}`), cell(`…${d.PRole||'Petitioner'}`, true))),
        para({text:'VERSUS', align:'center', spaceBefore:80, spaceAfter:80}),
        tbl(row(cell(`${d.Defendant||''}`), cell(`…${d.DRole||'Respondent'}`, true))),
        para({text:'APPLICATION FOR CERTIFIED COPY', bold:true, underline:true, align:'center', spaceBefore:360, spaceAfter:360}),
        para({text:"The Applicant above named most respectfully submits as under:", spaceAfter:200}),
        para({text:`1.\tThat the Applicant is the ${d.ApplicantType||'Petitioner'} in the ${d.SuitType||''} bearing Case No. ${d.CaseNo||''} of ${d.Year||''} ${d.SuitStatus||'pending'} before this Hon'ble Court.`, spaceAfter:120, lineSpacing:1.5}),
        para({text:`2.\tThat the said ${d.SuitType||''} was filed by ${d.Plaintiff||''} against ${d.Defendant||''} for legal relief.`, spaceAfter:120}),
        para({text:"3.\tThat the Applicant requires a certified copy of the following document(s):", spaceAfter:80}),
        ...docs.map(doc=>para({text:`\t• ${doc}`, indent:1, spaceAfter:60})),
        para({text:"4.\tThat the Applicant prays that this Hon'ble Court may be pleased to issue the certified copy/copies of the aforesaid document(s) to the Applicant at the earliest.", spaceBefore:160, spaceAfter:360}),
        para({text:`Place: ${d.Place||''}`, spaceAfter:60}),
        para({text:`Date:  ${d.Date||today}`, spaceAfter:240}),
        para({text:d.Applicant||'', align:'right', spaceAfter:60}),
        para({text:d.Mobile||'', align:'right'}),
    ].join('');
    const blob = await buildDocx(body, {top:CM(3),bottom:CM(2.5),left:CM(5),right:CM(2.5)});
    downloadBlob(blob, `Certified_Copy_${(d.Applicant||'Application').replace(/\s+/g,'_')}.docx`);
}

// ═══════════════════════════════════════════════════════════
// VAKALATNAMA
// ═══════════════════════════════════════════════════════════
async function generateVakalatnama(d) {
    const today    = new Date().toLocaleDateString('en-IN');
    const client   = d.Client || d.Applicant || '';
    const advocate = d.Advocate || '';
    const date     = d.Date || today;
    const body = [
        para({text:'VAKALATNAMA', bold:true, align:'center', size:32, spaceAfter:120}),
        para({text:(d.Court||'').toUpperCase(), bold:true, align:'center', spaceAfter:120}),
        para({text:`Case No. ${d.CaseNo||''}`, align:'right', spaceAfter:160}),
        tbl(row(cell(d.Petitioner||client), cell(`…${d.PRole||'Petitioner'}`, true))),
        para({text:'VERSUS', align:'center', spaceBefore:80, spaceAfter:80}),
        tbl(row(cell(d.Defendant||''), cell(`…${d.DRole||'Respondent'}`, true))),
        para({spaceAfter:160}),
        para({align:'justify', runs:[
            {text:'I/We, '},
            {text:client, bold:true},
            {text:`, residing at ${d.ClientAddress||d.Address||''}, do hereby appoint and retain:`}
        ], spaceAfter:80}),
        para({text:`\t• ${advocate}`, indent:1, spaceAfter:80}),
        para({text:"as my/our Advocate(s) to appear, act, plead and conduct the above case on my/our behalf and to do all lawful acts, deeds and things as may be necessary for the prosecution/defense of the said case.", align:'justify', spaceBefore:160, spaceAfter:240}),
        para({runs:[
            {text:'IN WITNESS WHEREOF, I/We have set my/our hand(s) on this '},
            {text:date, bold:true}
        ], spaceAfter:360}),
        tbl(
            row(cell('Accepted:'), cell('Executant(s):', true)) +
            row(cell(`\n\n_____________________\n${advocate}`), cell(`\n\n_____________________\n${client}`, true))
        ),
    ].join('');
    const blob = await buildDocx(body, {top:CM(2.5),bottom:CM(2.5),left:CM(4),right:CM(2.5)});
    downloadBlob(blob, `Vakalatnama_${client.replace(/\s+/g,'_')}.docx`);
}

// ═══════════════════════════════════════════════════════════
// NEW PETITION
// ═══════════════════════════════════════════════════════════
async function generateNewPetition(d) {
    const today     = new Date().toLocaleDateString('en-IN');
    const petitioner = d.Petitioner||'';
    const respondent = d.Respondent||'';
    const date       = d.Date||today;
    const place      = d.Place||'';
    let verifyDate   = `at ${place} on this date`;
    try {
        const dt = new Date(date);
        const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
        verifyDate = `at ${place} on this ${dt.getDate()} day of ${months[dt.getMonth()]} ${dt.getFullYear()}`;
    } catch(e){}

    const body = [
        para({text:(d.Court||'').toUpperCase(), bold:true, align:'center', size:28, spaceAfter:160}),
        para({text:d.PetitionType||'PETITION', bold:true, underline:true, align:'center', spaceAfter:100}),
        d.Subject ? para({text:d.Subject, align:'center', spaceAfter:240}) : '',
        para({text:`Case No. ${d.CaseNo||''}`, align:'right', spaceAfter:160}),
        borderedTbl([
            row(cell(petitioner), cell('')),
            row(cell(`Resident of: ${d.PetitionerAddress||''}`), cell('... Petitioner', true)),
        ].join('')),
        para({spaceAfter:100}),
        para({text:'Versus', bold:true, italic:true, align:'center', spaceAfter:100}),
        borderedTbl(row(cell(respondent), cell('... Respondent', true))),
        para({spaceAfter:240}),
        para({text:'May it please your lordships:', lineSpacing:1.5, spaceAfter:80}),
        para({text:'The petitioner submits as under:', lineSpacing:1.5, spaceAfter:240}),
        d.Facts ? para({text:'BRIEF FACTS', bold:true, underline:true, spaceAfter:100}) : '',
        d.Facts ? para({text:d.Facts, align:'justify', lineSpacing:1.5, spaceAfter:240}) : '',
        d.Grounds ? para({text:'GROUNDS', bold:true, underline:true, spaceAfter:100}) : '',
        d.Grounds ? para({text:d.Grounds, align:'justify', lineSpacing:1.5, spaceAfter:240}) : '',
        d.Relief ? para({text:'PRAYER', bold:true, underline:true, spaceAfter:100}) : '',
        d.Relief ? para({text:`In light of the above, it is most respectfully prayed that this Hon'ble Court may be pleased to: ${d.Relief}`, align:'justify', lineSpacing:1.5, spaceAfter:240}) : '',
        para({text:`Place: ${place}`, spaceAfter:80}),
        para({text:`Date:  ${date}`, spaceAfter:240}),
        para({text:petitioner, align:'right', spaceAfter:60}),
        para({text:'(Petitioner)', align:'right'}),
        pageBreak(),
        para({text:'VERIFICATION', bold:true, align:'center', spaceAfter:240}),
        para({text:`I, ${petitioner}, solemnly verify that the contents of the above petition are true to the best of my knowledge.`, lineSpacing:1.5, spaceAfter:160}),
        para({text:`Solemnly verified ${verifyDate}.`, lineSpacing:1.5, spaceAfter:360}),
        tbl(row(cell('Identified by'), cell('Deponent', true))),
        pageBreak(),
        para({text:'AFFIDAVIT', bold:true, align:'center', spaceAfter:240}),
        para({text:`I, ${petitioner}, state on solemn affirmation that the contents of the above paras are true to my knowledge.`, lineSpacing:1.5, spaceAfter:160}),
        para({text:`Solemnly verified ${verifyDate}.`, lineSpacing:1.5, spaceAfter:360}),
        tbl(row(cell('Identified by'), cell('Deponent', true))),
    ].filter(Boolean).join('');

    const blob = await buildDocx(body, {top:CM(3),bottom:CM(3),left:CM(5),right:CM(3)});
    downloadBlob(blob, `Petition_${petitioner.replace(/\s+/g,'_')}.docx`);
}

function borderedTbl(rowsHtml) { return tbl(rowsHtml, true); }

// ─── Main dispatcher ─────────────────────────────────────────────────────────
async function generateDocument(docType, data) {
    const generators = {
        'certified-copy': generateCertifiedCopy,
        'vakalatnama':    generateVakalatnama,
        'new-petition':  generateNewPetition,
    };
    const gen = generators[docType];
    if (!gen) throw new Error('Invalid document type');
    return gen(data);
}
