// Form Modal System

const COURT_OPTIONS = [
    "IN THE HIGH COURT OF BOMBAY AT GOA BENCH AT PORVORIM",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT MARGAO GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT MARGAO GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT VASCO GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT VASCO GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT MAPUSA GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT MAPUSA GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT PANJIM GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT PANJIM GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT PONDA GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT PONDA GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT QUEPEM GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT QUEPEM GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT SANGUEM GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT SANGUEM GOA",
    "IN THE COURT OF CIVIL JUDGE JUNIOR DIVISION AT CANACONA GOA",
    "IN THE COURT OF CIVIL JUDGE SENIOR DIVISION AT CANACONA GOA",
];

function courtOptions() {
    return COURT_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('');
}

function titleOptions(selected = 'Mr.') {
    return ['Mr.','Mrs.','Ms.','Dr.'].map(t =>
        `<option value="${t}" ${t === selected ? 'selected' : ''}>${t}</option>`
    ).join('');
}

function openDocumentForm(docType) {
    const forms = {
        'certified-copy': createCertifiedCopyForm,
        'vakalatnama': createVakalatnamaForm,
        'new-petition': createNewPetitionForm
    };
    
    const formCreator = forms[docType];
    if (!formCreator) return;
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title">${getDocumentTitle(docType)}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${formCreator()}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modalHTML;
    document.body.style.overflow = 'hidden';
    initFormLogic(docType);
}

function closeModal(event) {
    if (event && event.target.className !== 'modal-overlay' && event.type !== 'click') return;
    document.getElementById('modalContainer').innerHTML = '';
    document.body.style.overflow = 'auto';
}

function getDocumentTitle(docType) {
    const titles = {
        'certified-copy': 'Certified Copy Application',
        'vakalatnama': 'Vakalatnama',
        'new-petition': 'New Petition'
    };
    return titles[docType] || 'Document';
}

// ─────────────────────── CERTIFIED COPY FORM ───────────────────────
function createCertifiedCopyForm() {
    return `
        <form id="certifiedCopyForm" onsubmit="handleFormSubmit(event, 'certified-copy')">

            <div class="form-group">
                <label class="form-label">Select Court *</label>
                <select name="Court" class="form-select" required>
                    <option value="">Select court…</option>
                    ${courtOptions()}
                </select>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Case No. *</label>
                    <input type="text" name="CaseNo" class="form-input" required placeholder="e.g. 123/2024">
                </div>
                <div class="form-group">
                    <label class="form-label">Year *</label>
                    <input type="text" name="Year" class="form-input" required placeholder="e.g. 2024" maxlength="4">
                </div>
            </div>

            <div class="form-section-label">Petitioner / Appellant</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <select name="P_Title" class="form-select">${titleOptions()}</select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Plaintiff / Petitioner Name *</label>
                    <input type="text" name="Plaintiff" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-checkbox-row">
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Petitioner"> Petitioner</label>
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Appellant"> Appellant</label>
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Plaintiff"> Plaintiff</label>
            </div>

            <div class="form-section-label">Defendant / Respondent</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <select name="D_Title" class="form-select">${titleOptions()}</select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Defendant / Respondent Name *</label>
                    <input type="text" name="Defendant" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-checkbox-row">
                <label class="form-checkbox"><input type="checkbox" name="DRole" value="Defendant"> Defendant</label>
                <label class="form-checkbox"><input type="checkbox" name="DRole" value="Respondent"> Respondent</label>
            </div>

            <div class="form-section-label">Type of Applicant &amp; Suit</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Type of Applicant</label>
                    <select name="ApplicantType" class="form-select">
                        <option value="Petitioner">Petitioner</option>
                        <option value="Appellant">Appellant</option>
                        <option value="Plaintiff">Plaintiff</option>
                        <option value="Defendant">Defendant</option>
                        <option value="Respondent">Respondent</option>
                        <option value="Third Party">Third Party</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Type of Suit</label>
                    <select name="SuitType" class="form-select">
                        <option value="Civil Suit">Civil Suit</option>
                        <option value="Criminal Suit">Criminal Suit</option>
                        <option value="Writ Petition">Writ Petition</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Suit Status</label>
                    <select name="SuitStatus" class="form-select">
                        <option value="pending">Pending</option>
                        <option value="decided">Decided</option>
                    </select>
                </div>
            </div>

            <div class="form-section-label">Documents Needed</div>
            <div class="form-doc-list">
                <label class="form-checkbox"><input type="checkbox" name="doc_Plaint" value="Plaint"> Plaint</label>
                <label class="form-checkbox"><input type="checkbox" name="doc_WS" value="Written Statement"> Written Statement</label>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_App" onchange="toggleDocField('field_App',this)"> Application No.</label>
                    <input type="text" id="field_App" name="doc_App" class="form-input form-doc-field" placeholder="Enter App No." disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_IA" onchange="toggleDocField('field_IA',this)"> Interlocutory Application No.</label>
                    <input type="text" id="field_IA" name="doc_IA" class="form-input form-doc-field" placeholder="Enter IA No." disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_Reply" onchange="toggleDocField('field_Reply',this)"> Reply to Application dated</label>
                    <input type="text" id="field_Reply" name="doc_Reply" class="form-input form-doc-field" placeholder="Date/Details" disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_Order" onchange="toggleDocField('field_Order',this)"> Order dated</label>
                    <input type="text" id="field_Order" name="doc_Order" class="form-input form-doc-field" placeholder="Date" disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_Judg" onchange="toggleDocField('field_Judg',this)"> Judgment dated</label>
                    <input type="text" id="field_Judg" name="doc_Judg" class="form-input form-doc-field" placeholder="Date" disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_Evid" onchange="toggleDocField('field_Evid',this)"> Evidence of Witness dated</label>
                    <input type="text" id="field_Evid" name="doc_Evid" class="form-input form-doc-field" placeholder="Date/Witness" disabled>
                </div>
                <div class="form-doc-row">
                    <label class="form-checkbox"><input type="checkbox" id="cb_Exh" onchange="toggleDocField('field_Exh',this)"> Exhibit No.</label>
                    <input type="text" id="field_Exh" name="doc_Exh" class="form-input form-doc-field" placeholder="Exh No." disabled>
                </div>
            </div>

            <div class="form-section-label">Applicant Details</div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Applicant Full Name *</label>
                    <input type="text" name="Applicant" class="form-input" required placeholder="Full name">
                </div>
                <div class="form-group">
                    <label class="form-label">Mobile Number *</label>
                    <input type="tel" name="Mobile" class="form-input" required placeholder="10-digit number">
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" name="Date" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Place</label>
                    <input type="text" name="Place" class="form-input" value="Margao" placeholder="Margao">
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-submit">
                <span>Generate Document</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </button>
        </form>
    `;
}

// ─────────────────────── VAKALATNAMA FORM ───────────────────────
function createVakalatnamaForm() {
    return `
        <form id="vakalatnamaForm" onsubmit="handleFormSubmit(event, 'vakalatnama')">

            <div class="form-group">
                <label class="form-label">Select Court *</label>
                <select name="Court" class="form-select" required>
                    <option value="">Select court…</option>
                    ${courtOptions()}
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Case No. *</label>
                <input type="text" name="CaseNo" class="form-input" required placeholder="e.g. 456/2024">
            </div>

            <div class="form-section-label">Petitioner / Appellant</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <select name="P_Title" class="form-select">${titleOptions()}</select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Petitioner / Appellant Name *</label>
                    <input type="text" name="Petitioner" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-checkbox-row">
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Petitioner" checked> Petitioner</label>
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Appellant"> Appellant</label>
                <label class="form-checkbox"><input type="checkbox" name="PRole" value="Plaintiff"> Plaintiff</label>
            </div>

            <div class="form-section-label">Defendant / Respondent</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <select name="D_Title" class="form-select">${titleOptions()}</select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Defendant / Respondent Name *</label>
                    <input type="text" name="Defendant" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-checkbox-row">
                <label class="form-checkbox"><input type="checkbox" name="DRole" value="Defendant"> Defendant</label>
                <label class="form-checkbox"><input type="checkbox" name="DRole" value="Respondent" checked> Respondent</label>
            </div>

            <div class="form-section-label">Appointment Details</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">I / We</label>
                    <select name="AppointmentType" class="form-select">
                        <option value="I">I</option>
                        <option value="We">We</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Applicant Full Name *</label>
                    <input type="text" name="ApplicantName" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Complete Address (as per Aadhaar) *</label>
                <textarea name="Address" class="form-textarea" required placeholder="Full residential address" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Party Type</label>
                <select name="PartyTypeRole" class="form-select">
                    <option value="Petitioner">Petitioner</option>
                    <option value="Appellant">Appellant</option>
                    <option value="Plaintiff">Plaintiff</option>
                    <option value="Defendant">Defendant</option>
                    <option value="Respondent">Respondent</option>
                </select>
            </div>

            <div class="form-section-label">Select Advocate(s)</div>
            <div class="form-advocate-list" id="advocateList">
                <label class="form-checkbox">
                    <input type="checkbox" name="Advocate" value="Adv. IVAN J. SANTIMANO (Reg. No. MAH/3283/2011)">
                    Adv. IVAN J. SANTIMANO (Reg. No. MAH/3283/2011)
                </label>
                <label class="form-checkbox">
                    <input type="checkbox" name="Advocate" value="Adv. FEMILA BEPARI (Reg. No. MAH/392/2022)">
                    Adv. FEMILA BEPARI (Reg. No. MAH/392/2022)
                </label>
            </div>
            <div class="form-doc-row" style="margin-top:0.75rem; align-items:center; gap:0.75rem;">
                <label class="form-checkbox">
                    <input type="checkbox" id="cb_AddLawyer" onchange="toggleNewLawyer(this)"> Add New Lawyer
                </label>
                <input type="text" id="field_NewLawyer" class="form-input form-doc-field" placeholder="Enter Lawyer Name" disabled style="flex:1; min-width:0;">
                <button type="button" class="btn-icon-add" onclick="addNewLawyer()" title="Add">＋</button>
            </div>

            <div class="form-section-label">Signature Options</div>
            <label class="form-label" id="sliderLabel">Extra Executant Signatures: 0</label>
            <input type="range" name="ExtraExecutants" id="execSlider" min="0" max="10" value="0" class="form-slider" oninput="updateExecSlider(this)">
            <div id="extraExecFields"></div>

            <div class="form-section-label">Witness Date</div>
            <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" name="WitnessDate" class="form-input" required>
            </div>

            <button type="submit" class="btn btn-primary btn-submit">
                <span>Generate Document</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </button>
        </form>
    `;
}

// ─────────────────────── NEW PETITION FORM ───────────────────────
function createNewPetitionForm() {
    return `
        <form id="newPetitionForm" onsubmit="handleFormSubmit(event, 'new-petition')">

            <div class="form-group">
                <label class="form-label">Select Court *</label>
                <select name="Court" class="form-select" required>
                    <option value="">Select court…</option>
                    ${courtOptions()}
                </select>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Case No. *</label>
                    <input type="text" name="CaseNo" class="form-input" required placeholder="e.g. 123/2024">
                </div>
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" name="Date" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Place</label>
                    <input type="text" name="Place" class="form-input" value="Margao" placeholder="Margao">
                </div>
            </div>

            <div class="form-section-label">Petitioner Details</div>
            <div id="petitionerForms"></div>
            <button type="button" class="btn-add-party" onclick="addPersonForm('petitioner')">＋ Add More Petitioners</button>

            <div class="form-section-label" style="margin-top:1.5rem;">Defendant Details</div>
            <div id="defendantForms"></div>
            <button type="button" class="btn-add-party" onclick="addPersonForm('defendant')">＋ Add More Defendants</button>

            <div class="form-section-label" style="margin-top:1.5rem;">Gist of the Petition</div>
            <div class="form-group">
                <textarea name="PetitionText" class="form-textarea" rows="6" placeholder="Enter petition details…" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-submit">
                <span>Generate Document</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </button>
        </form>
    `;
}

// ─────────────────────── PERSON FORM (Petition) ───────────────────────
function personFormHTML(type, index) {
    const label = type === 'petitioner' ? 'Petitioner' : 'Defendant';
    const ageOptions = Array.from({length:83},(_,i)=>`<option value="${i+18}" ${i+18===30?'selected':''}>${i+18}</option>`).join('');
    return `
        <div class="person-form-card" id="${type}_${index}">
            <div class="person-form-title">${label} ${index + 1} Details</div>
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <select name="${type}_title_${index}" class="form-select">${titleOptions()}</select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">${label} Name *</label>
                    <input type="text" name="${type}_name_${index}" class="form-input" required placeholder="Full name">
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Relation</label>
                    <select name="${type}_relation_${index}" class="form-select">
                        <option value="Son Of">Son Of</option>
                        <option value="Daughter Of">Daughter Of</option>
                        <option value="Wife Of">Wife Of</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Father's / Husband's Name *</label>
                    <input type="text" name="${type}_parent_${index}" class="form-input" required placeholder="Parent/Spouse name">
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Age</label>
                    <select name="${type}_age_${index}" class="form-select">${ageOptions}</select>
                </div>
                <div class="form-group">
                    <label class="form-label">Occupation *</label>
                    <input type="text" name="${type}_occupation_${index}" class="form-input" required placeholder="e.g. Business">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Address (with Pincode) *</label>
                <textarea name="${type}_address_${index}" class="form-textarea" required placeholder="Full residential address with pincode" rows="2"></textarea>
            </div>
        </div>
    `;
}

// ─────────────────────── FORM LOGIC ───────────────────────
function initFormLogic(docType) {
    if (docType === 'new-petition') {
        petitionerCount = 0;
        defendantCount = 0;
        addPersonForm('petitioner');
        addPersonForm('defendant');
    }
}

let petitionerCount = 0;
let defendantCount = 0;

function addPersonForm(type) {
    if (type === 'petitioner') {
        const container = document.getElementById('petitionerForms');
        if (container) { container.insertAdjacentHTML('beforeend', personFormHTML('petitioner', petitionerCount)); petitionerCount++; }
    } else {
        const container = document.getElementById('defendantForms');
        if (container) { container.insertAdjacentHTML('beforeend', personFormHTML('defendant', defendantCount)); defendantCount++; }
    }
}

function toggleDocField(fieldId, checkbox) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.disabled = !checkbox.checked;
    if (!checkbox.checked) field.value = '';
}

function toggleNewLawyer(checkbox) {
    const field = document.getElementById('field_NewLawyer');
    if (!field) return;
    field.disabled = !checkbox.checked;
    if (!checkbox.checked) field.value = '';
}

function addNewLawyer() {
    const cb = document.getElementById('cb_AddLawyer');
    const field = document.getElementById('field_NewLawyer');
    const list = document.getElementById('advocateList');
    if (!field || !field.value.trim() || !list) return;
    const newLabel = document.createElement('label');
    newLabel.className = 'form-checkbox';
    newLabel.innerHTML = `<input type="checkbox" name="Advocate" value="${field.value.trim()}" checked> ${field.value.trim()}`;
    list.appendChild(newLabel);
    field.value = '';
    if (cb) { cb.checked = false; field.disabled = true; }
}

function updateExecSlider(slider) {
    const n = parseInt(slider.value);
    const label = document.getElementById('sliderLabel');
    if (label) label.textContent = `Extra Executant Signatures: ${n}`;
    const container = document.getElementById('extraExecFields');
    if (!container) return;
    const inputs = container.querySelectorAll('.form-group');
    if (n > inputs.length) {
        for (let i = inputs.length; i < n; i++) {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `<label class="form-label">Executant ${i+2} Name</label>
                <input type="text" name="ExtraExec_${i}" class="form-input" placeholder="Full name">`;
            container.appendChild(div);
        }
    } else {
        for (let i = inputs.length - 1; i >= n; i--) inputs[i].remove();
    }
}

// ─────────────────────── FORM SUBMIT ───────────────────────
function handleFormSubmit(event, docType) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span><span>Generating…</span>';

    let data = {};
    if (docType === 'certified-copy') data = collectCertifiedCopyData(form);
    else if (docType === 'vakalatnama') data = collectVakalatnamaData(form);
    else if (docType === 'new-petition') data = collectNewPetitionData(form);

    setTimeout(() => {
        generateDocument(docType, data)
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '✓ Document Generated!';
                setTimeout(() => { closeModal(); }, 1500);
            })
            .catch(error => {
                alert('Error generating document: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    }, 300);
}

function collectCertifiedCopyData(form) {
    const fd = new FormData(form);
    const pRoles = fd.getAll('PRole');
    const dRoles = fd.getAll('DRole');
    const docs = [];
    if (form.querySelector('[name=doc_Plaint]').checked) docs.push('Plaint');
    if (form.querySelector('[name=doc_WS]').checked) docs.push('Written Statement');
    [
        { cb:'cb_App',   field:'doc_App',   label:'Application No.' },
        { cb:'cb_IA',    field:'doc_IA',    label:'Interlocutory Application No.' },
        { cb:'cb_Reply', field:'doc_Reply', label:'Reply to Application' },
        { cb:'cb_Order', field:'doc_Order', label:'Order dated' },
        { cb:'cb_Judg',  field:'doc_Judg',  label:'Judgment dated' },
        { cb:'cb_Evid',  field:'doc_Evid',  label:'Evidence of Witness' },
        { cb:'cb_Exh',   field:'doc_Exh',   label:'Exhibit No.' },
    ].forEach(({ cb, field, label }) => {
        const cbEl = document.getElementById(cb);
        if (cbEl && cbEl.checked) {
            const val = form.querySelector(`[name=${field}]`);
            docs.push(`${label}${val && val.value ? ' ' + val.value : ''}`);
        }
    });
    return {
        Court: fd.get('Court'), CaseNo: fd.get('CaseNo'), Year: fd.get('Year'),
        P_Title: fd.get('P_Title'), Plaintiff: fd.get('Plaintiff'),
        PRole: pRoles.length ? pRoles.join(' / ') : 'Petitioner',
        D_Title: fd.get('D_Title'), Defendant: fd.get('Defendant'),
        DRole: dRoles.length ? dRoles.join(' / ') : 'Respondent',
        ApplicantType: fd.get('ApplicantType'), SuitType: fd.get('SuitType'),
        SuitStatus: fd.get('SuitStatus'), Docs: docs,
        Applicant: fd.get('Applicant'), Mobile: fd.get('Mobile'),
        Date: formatDate(fd.get('Date')), Place: fd.get('Place') || 'Margao',
    };
}

function collectVakalatnamaData(form) {
    const fd = new FormData(form);
    const pRoles = fd.getAll('PRole');
    const dRoles = fd.getAll('DRole');
    const advocates = fd.getAll('Advocate').filter(Boolean);
    const extraExecCount = parseInt(fd.get('ExtraExecutants') || '0');
    const extraNames = [];
    for (let i = 0; i < extraExecCount; i++) extraNames.push(fd.get(`ExtraExec_${i}`) || `Executant ${i+2}`);
    return {
        Court: fd.get('Court'), CaseNo: fd.get('CaseNo'),
        P_Title: fd.get('P_Title'), Petitioner: fd.get('Petitioner'),
        PRole: pRoles.length ? pRoles.join(' / ') : 'Petitioner',
        D_Title: fd.get('D_Title'), Defendant: fd.get('Defendant'),
        DRole: dRoles.length ? dRoles.join(' / ') : 'Respondent',
        AppointmentType: fd.get('AppointmentType') || 'I',
        ApplicantName: fd.get('ApplicantName'), Address: fd.get('Address'),
        PartyTypeRole: fd.get('PartyTypeRole') || 'Petitioner',
        Advocates: advocates, ExtraExecutants: extraExecCount, ExtraExecutantNames: extraNames,
        WitnessDate: formatDate(fd.get('WitnessDate')),
    };
}

function collectNewPetitionData(form) {
    const fd = new FormData(form);
    const petitioners = [];
    for (let i = 0; i < petitionerCount; i++) {
        petitioners.push({
            title: fd.get(`petitioner_title_${i}`) || 'Mr.',
            name: fd.get(`petitioner_name_${i}`) || '',
            parent_relation: fd.get(`petitioner_relation_${i}`) || 'Son Of',
            parent_name: fd.get(`petitioner_parent_${i}`) || '',
            age: fd.get(`petitioner_age_${i}`) || '30',
            occupation: fd.get(`petitioner_occupation_${i}`) || '',
            address: fd.get(`petitioner_address_${i}`) || '',
        });
    }
    const defendants = [];
    for (let i = 0; i < defendantCount; i++) {
        defendants.push({
            title: fd.get(`defendant_title_${i}`) || 'Mr.',
            name: fd.get(`defendant_name_${i}`) || '',
            parent_relation: fd.get(`defendant_relation_${i}`) || 'Son Of',
            parent_name: fd.get(`defendant_parent_${i}`) || '',
            age: fd.get(`defendant_age_${i}`) || '30',
            occupation: fd.get(`defendant_occupation_${i}`) || '',
            address: fd.get(`defendant_address_${i}`) || '',
        });
    }
    return {
        court: fd.get('Court'), case_no: fd.get('CaseNo'),
        petitioners, defendants,
        petition_text: fd.get('PetitionText') || '',
        place: fd.get('Place') || 'Margao',
        date: formatDate(fd.get('Date')),
    };
}

function formatDate(dateStr) {
    if (!dateStr) return new Date().toLocaleDateString('en-GB');
    const [y,m,d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}
