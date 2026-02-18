// Form Modal System

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

function createCertifiedCopyForm() {
    return `
        <form id="certifiedCopyForm" onsubmit="handleFormSubmit(event, 'certified-copy')">
            <div class="form-group">
                <label class="form-label">Court Name *</label>
                <input type="text" name="Court" class="form-input" required placeholder="e.g., High Court of Delhi">
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Case Number *</label>
                    <input type="text" name="CaseNo" class="form-input" required placeholder="e.g., 123/2024">
                </div>
                <div class="form-group">
                    <label class="form-label">Year *</label>
                    <input type="text" name="Year" class="form-input" required placeholder="e.g., 2024">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Suit Type *</label>
                <select name="SuitType" class="form-select" required>
                    <option value="">Select suit type</option>
                    <option value="Civil Suit">Civil Suit</option>
                    <option value="Criminal Case">Criminal Case</option>
                    <option value="Writ Petition">Writ Petition</option>
                    <option value="Appeal">Appeal</option>
                </select>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Petitioner Name *</label>
                    <input type="text" name="Plaintiff" class="form-input" required placeholder="Full name">
                </div>
                <div class="form-group">
                    <label class="form-label">Respondent Name *</label>
                    <input type="text" name="Defendant" class="form-input" required placeholder="Full name">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Applicant Name *</label>
                <input type="text" name="Applicant" class="form-input" required placeholder="Your name">
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Mobile Number *</label>
                    <input type="tel" name="Mobile" class="form-input" required pattern="[0-9]{10}" placeholder="10-digit number">
                </div>
                <div class="form-group">
                    <label class="form-label">Place *</label>
                    <input type="text" name="Place" class="form-input" required placeholder="e.g., New Delhi">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Documents Required (one per line)</label>
                <textarea name="Docs" class="form-textarea" placeholder="e.g., Final Order dated 15.01.2024&#10;Judgment dated 20.01.2024"></textarea>
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

function createVakalatnamaForm() {
    return `
        <form id="vakalatnamaForm" onsubmit="handleFormSubmit(event, 'vakalatnama')">
            <div class="form-group">
                <label class="form-label">Court Name *</label>
                <input type="text" name="Court" class="form-input" required placeholder="e.g., District Court, Delhi">
            </div>
            
            <div class="form-group">
                <label class="form-label">Case Number *</label>
                <input type="text" name="CaseNo" class="form-input" required placeholder="e.g., 456/2024">
            </div>
            
            <div class="form-group">
                <label class="form-label">Client Name *</label>
                <input type="text" name="Client" class="form-input" required placeholder="Full name of client">
            </div>
            
            <div class="form-group">
                <label class="form-label">Client Father's/Husband's Name *</label>
                <input type="text" name="ClientFather" class="form-input" required placeholder="Father's or husband's name">
            </div>
            
            <div class="form-group">
                <label class="form-label">Client Address *</label>
                <textarea name="ClientAddress" class="form-textarea" required placeholder="Complete residential address"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Advocate Name *</label>
                <input type="text" name="Advocate" class="form-input" required placeholder="Full name of advocate">
            </div>
            
            <div class="form-group">
                <label class="form-label">Advocate's Office Address *</label>
                <textarea name="AdvocateAddress" class="form-textarea" required placeholder="Complete office address"></textarea>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Place *</label>
                    <input type="text" name="Place" class="form-input" required placeholder="e.g., New Delhi">
                </div>
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" name="Date" class="form-input" required>
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

function createNewPetitionForm() {
    return `
        <form id="newPetitionForm" onsubmit="handleFormSubmit(event, 'new-petition')">
            <div class="form-group">
                <label class="form-label">Court Name *</label>
                <input type="text" name="Court" class="form-input" required placeholder="e.g., High Court of Karnataka">
            </div>
            
            <div class="form-group">
                <label class="form-label">Petition Type *</label>
                <select name="PetitionType" class="form-select" required>
                    <option value="">Select petition type</option>
                    <option value="Writ Petition">Writ Petition</option>
                    <option value="Civil Petition">Civil Petition</option>
                    <option value="Criminal Petition">Criminal Petition</option>
                    <option value="Miscellaneous Petition">Miscellaneous Petition</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Subject Matter *</label>
                <input type="text" name="Subject" class="form-input" required placeholder="Brief subject of the petition">
            </div>
            
            <div class="form-group">
                <label class="form-label">Petitioner Name *</label>
                <input type="text" name="Petitioner" class="form-input" required placeholder="Full name of petitioner">
            </div>
            
            <div class="form-group">
                <label class="form-label">Petitioner Address *</label>
                <textarea name="PetitionerAddress" class="form-textarea" required placeholder="Complete residential address"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Respondent Name *</label>
                <input type="text" name="Respondent" class="form-input" required placeholder="Full name of respondent">
            </div>
            
            <div class="form-group">
                <label class="form-label">Brief Facts of the Case *</label>
                <textarea name="Facts" class="form-textarea" required style="min-height: 150px;" placeholder="Provide a brief chronological account of events"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Grounds for Relief *</label>
                <textarea name="Grounds" class="form-textarea" required placeholder="Legal grounds and reasons for seeking relief"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Relief Sought *</label>
                <textarea name="Relief" class="form-textarea" required placeholder="Specific relief or remedy requested from the court"></textarea>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Place *</label>
                    <input type="text" name="Place" class="form-input" required placeholder="e.g., Bengaluru">
                </div>
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" name="Date" class="form-input" required>
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

function handleFormSubmit(event, docType) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span><span>Generating...</span>';
    
    // Get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        if (key === 'Docs' && value) {
            data[key] = value.split('\n').filter(d => d.trim());
        } else {
            data[key] = value;
        }
    });
    
    // Generate document
    setTimeout(() => {
        generateDocument(docType, data)
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '✓ Document Generated!';
                setTimeout(() => {
                    closeModal();
                }, 1500);
            })
            .catch(error => {
                alert('Error generating document: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    }, 500);
}
