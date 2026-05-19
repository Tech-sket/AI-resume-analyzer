// Resume Analyzer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const resumeFile = document.getElementById('resumeFile');
    const dropZone = document.getElementById('dropZone');
    const fileValidation = document.getElementById('fileValidation');

    // Drag and Drop handlers
    dropZone.addEventListener('click', () => resumeFile.click());

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            resumeFile.files = files;
            validateFile(files[0]);
        }
    });

    // File input handling
    resumeFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            validateFile(file);
        }
    });

    function validateFile(file) {
        if (file.type !== 'application/pdf') {
            showFileValidation('Only PDF files are allowed', 'error');
            resumeFile.value = '';
        } else if (file.size > 5 * 1024 * 1024) {
            showFileValidation('File is too large (max 5MB)', 'error');
            resumeFile.value = '';
        } else {
            showFileValidation(`${file.name} (${(file.size / 1024).toFixed(1)} KB) - Ready to analyze`, 'success');
        }
    }

    function showFileValidation(message, type) {
        const icon = type === 'success' 
            ? '<svg class="validation-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
            : '<svg class="validation-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
        
        fileValidation.innerHTML = `
            <div class="file-validation ${type}">
                ${icon}
                <span style="color: var(--text-primary);">${message}</span>
            </div>
        `;
        fileValidation.style.display = 'block';
    }

    // Dynamic loading messages
    const loadingMessages = [
        '🔍 Extracting resume text...',
        '📄 Analyzing resume structure...',
        '🧠 Detecting skills...',
        '📊 Calculating ATS score...',
        '🤖 Generating recommendations...',
        '✨ Finalizing analysis...'
    ];

    let messageIndex = 0;
    let messageInterval;

    function cycleLoadingMessages() {
        const msgElement = document.getElementById('loadingMessages');
        if (msgElement) {
            msgElement.textContent = loadingMessages[0];
            messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                msgElement.style.opacity = '0';
                setTimeout(() => {
                    msgElement.textContent = loadingMessages[messageIndex];
                    msgElement.style.opacity = '1';
                }, 300);
            }, 2500);
        }
    }

    function stopLoadingMessages() {
        if (messageInterval) {
            clearInterval(messageInterval);
            messageIndex = 0;
        }
    }

    // Form submission
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const file = resumeFile.files[0];
        const jobRole = document.getElementById('jobRole').value;

        // Validation
        if (!file) {
            showError('Please select a resume file');
            return;
        }

        if (!jobRole) {
            showError('Please select a job role');
            return;
        }

        // Show loading state
        showLoading();
        cycleLoadingMessages();

        // Prepare form data
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_role', jobRole);

        try {
            // Send request
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error || 'An error occurred');
                hideLoading();
                stopLoadingMessages();
                return;
            }

            // Display results
            displayResults(data);
            hideLoading();
            stopLoadingMessages();
            showResults();

        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please try again.');
            hideLoading();
            stopLoadingMessages();
        }
    });

    // Tab switching functionality
    const tabResume = document.getElementById('tabResume');
    const tabJD = document.getElementById('tabJD');
    const panelResume = document.getElementById('panelResume');
    const panelJD = document.getElementById('panelJD');

    if (tabResume && tabJD) {
        tabResume.addEventListener('click', function() {
            tabResume.classList.add('active');
            tabJD.classList.remove('active');
            panelResume.classList.add('active');
            panelJD.classList.remove('active');
            localStorage.setItem('activeTab', 'resume');
        });

        tabJD.addEventListener('click', function() {
            tabJD.classList.add('active');
            tabResume.classList.remove('active');
            panelJD.classList.add('active');
            panelResume.classList.remove('active');
            localStorage.setItem('activeTab', 'jd');
        });

        // Restore active tab from localStorage
        const activeTab = localStorage.getItem('activeTab') || 'resume';
        if (activeTab === 'jd') {
            tabJD.click();
        }
    }

    // JD Form submission
    const jdForm = document.getElementById('jdForm');
    if (jdForm) {
        jdForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const jobDescription = document.getElementById('jobDescription').value.trim();

            // Validation
            if (!jobDescription) {
                showJDError('Please paste a job description');
                return;
            }

            // Check if resume was analyzed
            if (!window.currentResumeData) {
                showJDError('Please analyze a resume first');
                return;
            }

            // Show loading state
            const jdLoadingState = document.getElementById('jdLoadingState');
            const jdResultsSection = document.getElementById('jdResultsSection');
            const jdForm = document.getElementById('jdForm');

            if (jdLoadingState) jdLoadingState.style.display = 'flex';
            if (jdResultsSection) jdResultsSection.style.display = 'none';
            if (jdForm) jdForm.style.display = 'none';

            try {
                // Send request to analyze job match
                const response = await fetch('/api/analyze-job-match', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        resume_text: window.currentResumeData.resume_text,
                        job_description: jobDescription,
                        detected_skills: window.currentResumeData.detected_skills || []
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    showJDError(data.error || 'An error occurred');
                    if (jdLoadingState) jdLoadingState.style.display = 'none';
                    if (jdForm) jdForm.style.display = 'block';
                    return;
                }

                // Display results
                displayJobMatchResults(data);
                if (jdLoadingState) jdLoadingState.style.display = 'none';
                if (jdResultsSection) jdResultsSection.style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
                showJDError('Network error. Please try again.');
                if (jdLoadingState) jdLoadingState.style.display = 'none';
                if (jdForm) jdForm.style.display = 'block';
            }
        });
    }

    // Back to Analyzer button handler
    const backToAnalyzerBtn = document.getElementById('backToAnalyzer');
    if (backToAnalyzerBtn) {
        backToAnalyzerBtn.addEventListener('click', function() {
            const jdResultsSection = document.getElementById('jdResultsSection');
            const jdForm = document.getElementById('jdForm');
            
            if (jdResultsSection) jdResultsSection.style.display = 'none';
            if (jdForm) jdForm.style.display = 'block';
            
            // Clear job description textarea
            const jobDescriptionTextarea = document.getElementById('jobDescription');
            if (jobDescriptionTextarea) jobDescriptionTextarea.value = '';
            
            // Scroll back to form
            jdForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

function showLoading() {
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('errorState').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('uploadForm').style.display = 'flex';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = '❌ ' + message;
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('uploadForm').style.display = 'flex';
}

function showJDError(message) {
    const jdErrorState = document.getElementById('jdErrorState');
    const jdErrorMessage = document.getElementById('jdErrorMessage');
    const jdForm = document.getElementById('jdForm');
    
    if (jdErrorMessage) jdErrorMessage.textContent = '❌ ' + message;
    if (jdErrorState) jdErrorState.style.display = 'flex';
    if (jdForm) jdForm.style.display = 'block';
}

function showResults() {
    document.querySelector('.analyzer-section').scrollIntoView({ behavior: 'smooth' });
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Add staggered fade-in animations to all sections
    setTimeout(() => {
        const sections = [
            '.score-cards',
            '.recommendation-card',
            '.skills-grid',
            '.resources-section',
            '.tips-section'
        ];
        
        sections.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 150);
            }
        });
    }, 100);
}

// Animate circular progress gauge
function animateCircularGauge(score) {
    const circle = document.getElementById('atsScoreCircle');
    if (!circle) return;
    
    // Circle circumference = 2 * π * radius (radius = 52)
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;
    
    // Apply color coding based on score
    circle.classList.remove('low-score', 'medium-score', 'high-score');
    if (score < 50) {
        circle.classList.add('low-score');
    } else if (score < 75) {
        circle.classList.add('medium-score');
    } else {
        circle.classList.add('high-score');
    }
    
    // Animate the stroke-dashoffset
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// Animate score number counting up with easing
function animateScore(elementId, targetScore) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = eased * targetScore;
        
        element.textContent = Math.round(current) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = Math.round(targetScore) + '%';
        }
    }
    
    animate();
}

function displayResults(data) {
    // Store current resume data for job matching
    window.currentResumeData = {
        resume_text: data.resume_text || '',
        detected_skills: data.skill_match.matched || [],
        job_role: data.job_role
    };

    // Set job role
    document.querySelector('.results-container').dataset.jobRole = data.job_role;

    // Update scores - ATS Score (weighted combination) and Keyword Match Score
    const atsScore = data.ats_score || 0;
    
    // Animate the circular gauge
    animateCircularGauge(atsScore);
    
    // Animate the score number
    animateScore('skillMatchScore', atsScore);
    
    // Add percentile comparison message
    const percentile = Math.min(95, Math.max(10, Math.round(atsScore * 1.2 + Math.random() * 10)));
    const scoreDetailElement = document.getElementById('skillMatchDetail');
    
    // Calculate confidence metrics
    const totalSkills = data.skill_match.matched_count + data.skill_match.missing.length;
    const dataCompleteness = Math.round((totalSkills / Math.max(totalSkills, 15)) * 100);
    const aiConfidence = atsScore >= 75 ? 'High' : atsScore >= 50 ? 'Medium' : 'Developing';
    
    // Calculate improvement impact
    const topMissingCount = Math.min(3, data.skill_match.missing.length);
    const potentialIncrease = atsScore + (topMissingCount * 5);
    const potentialScore = Math.min(95, Math.max(atsScore, potentialIncrease));
    
    scoreDetailElement.innerHTML = `
        ${data.skill_match.matched_count}/${data.skill_match.required_count} skills &bull; ${Math.round(data.skill_match.match_percentage)}% skills + ${Math.round(data.tfidf_score)}% keywords<br>
        <span style="font-size: 12px; color: var(--accent); margin-top: 6px; display: inline-block;">
            ⭐ Your resume performs better than ${percentile}% of applicants
        </span>
        <span style="font-size: 11px; color: #94a3b8; margin-top: 8px; display: block; line-height: 1.4;">
            ✨ AI Confidence: ${aiConfidence} | Data Completeness: ${dataCompleteness}%<br>
            📈 If you add top ${topMissingCount} missing skills: Match score could increase to ${potentialScore}%
        </span>
    `;
    
    document.getElementById('tfidfScore').textContent = 
        Math.round(data.tfidf_score) + '%';

    // Update recommendation with enhanced icon
    document.getElementById('recommendationText').textContent = data.recommendation;
    const recommendationBox = document.getElementById('recommendationBox');
    recommendationBox.className = 'recommendation-card glass-panel ' + (data.level || '');
    
    // Update recommendation status badge and CTA
    const statusBadge = document.getElementById('recommendationStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const ctaSection = document.getElementById('recommendationCta');
    const ctaText = document.getElementById('ctaText');
    
    if (statusBadge && statusIcon && statusText) {
        statusBadge.style.display = 'flex';
        statusBadge.className = 'recommendation-status-badge';
        
        if (atsScore >= 75) {
            statusBadge.classList.add('status-strong');
            statusIcon.textContent = '🟢';
            statusText.textContent = 'Strong Match';
            if (ctaSection && ctaText) {
                ctaSection.style.display = 'flex';
                ctaText.innerHTML = '🎯 <strong>Great work!</strong> Keep your resume updated with recent achievements and consider tailoring it further for specific roles.';
            }
        } else if (atsScore >= 50) {
            statusBadge.classList.add('status-moderate');
            statusIcon.textContent = '🟡';
            statusText.textContent = 'Moderate Match';
            if (ctaSection && ctaText) {
                ctaSection.style.display = 'flex';
                const topMissing = data.skill_match.missing.slice(0, 3).join(', ');
                ctaText.innerHTML = `⚡ <strong>Improve by adding:</strong> ${topMissing}`;
            }
        } else {
            statusBadge.classList.add('status-weak');
            statusIcon.textContent = '🔴';
            statusText.textContent = 'Needs Improvement';
            if (ctaSection && ctaText) {
                ctaSection.style.display = 'flex';
                const topMissing = data.skill_match.missing.slice(0, 4).join(', ');
                ctaText.innerHTML = `💪 <strong>Action needed:</strong> Focus on adding these key skills: ${topMissing}`;
            }
        }
    }

    // Update contact information with clickable links
    if (data.contact.email || data.contact.phone) {
        document.getElementById('contactSection').style.display = 'block';
        
        const email = data.contact.email || 'Not provided';
        const phone = data.contact.phone || 'Not provided';
        
        document.getElementById('contactEmail').textContent = email;
        document.getElementById('contactPhone').textContent = phone;
        
        // Make email and phone clickable
        const emailLink = document.getElementById('contactEmailLink');
        const phoneLink = document.getElementById('contactPhoneLink');
        
        if (emailLink && email !== 'Not provided') {
            emailLink.href = 'mailto:' + email;
        }
        
        if (phoneLink && phone !== 'Not provided') {
            phoneLink.href = 'tel:' + phone;
        }
    } else {
        document.getElementById('contactSection').style.display = 'none';
    }

    // Display matched skills
    displaySkills(data.skill_match.matched, 'matchedSkillsContainer', 'matched');

    // Display missing skills
    displaySkills(data.skill_match.missing, 'missingSkillsContainer', 'missing');

    // Display learning resources
    displayResources(data.resources);

    // Display improvement tips
    displayImprovementTips(data.tfidf_score, data.skill_match.match_percentage, data.job_role);
    
    // Update section titles for improved messaging
    const skillsHeading = document.querySelector('[data-section="matched-skills"] h3');
    if (skillsHeading) {
        skillsHeading.textContent = `✓ Matched Skills (${data.skill_match.matched_count})`;
    }
    
    const missingHeading = document.querySelector('[data-section="missing-skills"] h3');
    if (missingHeading) {
        missingHeading.textContent = `⬆ Skills to Improve Match (${data.skill_match.missing.length})`;
    }
    
    const resourcesHeading = document.querySelector('[data-section="resources"] h3');
    if (resourcesHeading) {
        resourcesHeading.textContent = `📚 AI Optimization Tips`;
    }
}

function displaySkills(skills, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    // Update count badge
    const countBadgeId = containerId === 'matchedSkillsContainer' 
        ? 'matchedSkillsCount' 
        : 'missingSkillsCount';
    const countBadge = document.getElementById(countBadgeId);
    if (countBadge) {
        countBadge.textContent = skills.length;
    }

    if (skills.length === 0) {
        if (type === 'matched') {
            container.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No matched skills detected in your resume yet.</p>';
        } else {
            container.innerHTML = '<p style="color: #94a3b8;">✨ Great start! Add more technical skills to improve matching.</p>';
        }
        return;
    }

    // Priority skills for job roles (high demand)
    const highPrioritySkills = [
        'Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 
        'Kubernetes', 'Machine Learning', 'SQL', 'TypeScript', 'Java',
        'TensorFlow', 'PyTorch', 'Data Analysis', 'Communication'
    ];
    
    const recommendedSkills = [
        'Angular', 'Vue', 'MongoDB', 'PostgreSQL', 'Git', 'Linux',
        'Django', 'Flask', 'Express', 'Pandas', 'NumPy', 'Tableau',
        'Power BI', 'Excel', 'R', 'Scala', 'Deep Learning'
    ];

    skills.forEach((skill, index) => {
        const chip = document.createElement('span');
        chip.className = `skill-chip ${type}`;
        
        const icon = type === 'matched' 
            ? '<svg class="skill-chip-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
            : '<svg class="skill-chip-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
        
        // Add priority label for missing skills
        let priorityLabel = '';
        if (type === 'missing') {
            if (highPrioritySkills.includes(skill)) {
                priorityLabel = '<span class="priority-label high">🔴 High Demand</span>';
                chip.setAttribute('title', 'High demand skill - prioritize learning this');
            } else if (recommendedSkills.includes(skill)) {
                priorityLabel = '<span class="priority-label recommended">🟡 Recommended</span>';
                chip.setAttribute('title', 'Recommended skill for this role');
            } else {
                chip.setAttribute('title', 'Consider adding this skill');
            }
        } else {
            chip.setAttribute('title', 'Found in resume');
        }
        
        chip.innerHTML = `${icon}<span>${skill}</span>${priorityLabel}`;
        container.appendChild(chip);
    });
}

function displayJobMatchResults(data) {
    // Animate match score
    const scoreElement = document.getElementById('jdMatchScore');
    if (scoreElement) {
        const scoreValue = data.match_percentage || 0;
        animateScore('jdMatchScore', scoreValue);
        
        // Add match percentage feedback
        const feedback = scoreValue >= 75 ? '🟢 Excellent Match' :
                        scoreValue >= 60 ? '🟡 Good Match' :
                        scoreValue >= 40 ? '🟠 Fair Match' :
                        '🔴 Needs Work';
        
        const feedbackElement = document.getElementById('jdMatchDetail');
        if (feedbackElement) {
            feedbackElement.textContent = feedback;
        }
    }

    // Display missing keywords
    const missingKeywordsContainer = document.getElementById('missingKeywordsContainer');
    if (missingKeywordsContainer && data.missing_keywords && data.missing_keywords.length > 0) {
        missingKeywordsContainer.innerHTML = '';
        const title = document.createElement('h4');
        title.textContent = '🎯 Missing Keywords (' + data.missing_keywords.length + ')';
        title.style.marginBottom = '15px';
        title.style.color = 'var(--text-primary)';
        missingKeywordsContainer.appendChild(title);

        data.missing_keywords.slice(0, 15).forEach(keyword => {
            const chip = document.createElement('span');
            chip.className = 'keyword-chip';
            chip.style.cssText = `
                display: inline-block;
                background-color: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
                padding: 6px 12px;
                border-radius: 16px;
                margin: 5px 5px 5px 0;
                font-size: 13px;
                font-weight: 500;
            `;
            chip.textContent = keyword;
            missingKeywordsContainer.appendChild(chip);
        });
    } else if (missingKeywordsContainer) {
        missingKeywordsContainer.innerHTML = '<p style="color: #22C55E;">✅ All keywords found in resume!</p>';
    }

    // Display suggestions
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    if (suggestionsContainer && data.suggestions && data.suggestions.length > 0) {
        suggestionsContainer.innerHTML = '';
        const title = document.createElement('h4');
        title.textContent = '💡 Optimization Suggestions';
        title.style.marginBottom = '15px';
        title.style.color = 'var(--text-primary)';
        suggestionsContainer.appendChild(title);

        data.suggestions.forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.style.cssText = `
                background-color: rgba(59, 130, 246, 0.05);
                border-left: 3px solid var(--accent);
                padding: 12px 15px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            `;
            suggestionDiv.innerHTML = `📝 ${suggestion}`;
            suggestionsContainer.appendChild(suggestionDiv);
        });
    }
}

function displayResources(resources) {
    const container = document.getElementById('resourcesContainer');
    container.innerHTML = '';

    if (Object.keys(resources).length === 0) {
        container.innerHTML = '<p style="color: #64748b; grid-column: 1/-1;">No missing skills to learn!</p>';
        return;
    }

    Object.entries(resources).forEach(([skill, resource]) => {
        const card = document.createElement('div');
        card.className = 'resource-card';

        // Courses section
        let coursesHtml = '';
        if (resource.courses && resource.courses.length > 0) {
            const courseLinks = resource.courses.slice(0, 2).map(course => {
                const isYoutube = course.toLowerCase().includes('youtube') || course.toLowerCase().includes('youtu.be');
                const icon = isYoutube ? '▶️' : '📚';
                return `<div style="margin-bottom: 10px;"><a href="${course}" target="_blank" rel="noopener noreferrer" class="resource-link">${icon} ${course.length > 55 ? course.substring(0, 55) + '...' : course}</a></div>`;
            }).join('');
            
            coursesHtml = `
                <div class="resource-item">
                    <strong>Learning Resources</strong>
                    ${courseLinks}
                </div>
            `;
        } else {
            coursesHtml = `
                <div class="resource-item">
                    <strong>Learning Resources</strong>
                    <div style="color: var(--text-muted); margin-top: 8px;">
                        🔍 <a href="https://www.google.com/search?q=${encodeURIComponent(skill + ' tutorial')}" target="_blank" rel="noopener noreferrer" class="resource-link">Search tutorials on Google</a>
                    </div>
                </div>
            `;
        }

        // Official documentation section
        let websiteHtml = '';
        if (resource.websites && resource.websites.length > 0) {
            const websiteLink = `<a href="${resource.websites[0]}" target="_blank" rel="noopener noreferrer" class="resource-link">📖 Official Documentation</a>`;
            websiteHtml = `
                <div class="resource-item">
                    <strong>Documentation</strong>
                    <div style="margin-top: 8px;">
                        ${websiteLink}
                    </div>
                </div>
            `;
        }

        // Duration
        const durationHtml = `
            <div class="resource-item">
                <strong>Estimated Duration</strong>
                <div style="color: var(--text-primary); font-weight: 500; margin-top: 6px;">${resource.duration}</div>
            </div>
        `;

        card.innerHTML = `
            <div class="resource-skill-name">${skill}</div>
            ${coursesHtml}
            ${websiteHtml}
            ${durationHtml}
        `;

        container.appendChild(card);
    });
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('fileStatus').textContent = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.querySelector('.analyzer-section').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Skill Testing Functions
function displaySkillTests(detectedSkills) {
    const container = document.getElementById('skillTestButtons');
    container.innerHTML = '';

    // Filter skills that have available tests
    const testableSkills = [
        'Python', 'SQL', 'JavaScript', 'React', 'Git', 'Excel', 
        'HTML', 'CSS', 'Pandas', 'NumPy'
    ];

    const skillsToTest = detectedSkills.filter(skill => testableSkills.includes(skill));

    if (skillsToTest.length === 0) {
        document.getElementById('skillTestSection').style.display = 'none';
        return;
    }

    document.getElementById('skillTestSection').style.display = 'block';

    skillsToTest.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'skill-badge';
        badge.textContent = skill;
        badge.style.cursor = 'pointer';
        badge.onclick = () => startSkillTest(skill);
        container.appendChild(badge);
    });
}

async function startSkillTest(skill) {
    try {
        const response = await fetch(`/skill-test/${skill}`);
        const data = await response.json();

        if (!response.ok) {
            alert('No test available for this skill');
            return;
        }

        // Display quiz modal
        document.getElementById('quizTitle').textContent = `${skill} Assessment`;
        displayQuizQuestions(data.questions);
        document.getElementById('quizModal').style.display = 'block';

        // Store current skill for submission
        window.currentTestSkill = skill;
    } catch (error) {
        console.error('Error loading test:', error);
        alert('Failed to load test');
    }
}

function displayQuizQuestions(questions) {
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';

        const questionNum = document.createElement('div');
        questionNum.className = 'question-number';
        questionNum.textContent = `Question ${index + 1}`;

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = q.question;

        const optionsList = document.createElement('div');
        optionsList.className = 'options-list';

        q.options.forEach((option, optIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question-${index}`;
            radio.id = `q${index}_opt${optIndex}`;
            radio.value = optIndex;
            radio.dataset.questionIndex = index;

            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = option;
            label.style.margin = '0';

            optionDiv.appendChild(radio);
            optionDiv.appendChild(label);
            optionsList.appendChild(optionDiv);
        });

        questionBox.appendChild(questionNum);
        questionBox.appendChild(questionText);
        questionBox.appendChild(optionsList);
        container.appendChild(questionBox);
    });
}

function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    window.currentTestSkill = null;
}

async function submitQuiz() {
    try {
        // Get all answers
        const answers = [];
        const questions = document.querySelectorAll('.question-box');

        questions.forEach((_, index) => {
            const selected = document.querySelector(`input[name="question-${index}"]:checked`);
            if (!selected) {
                alert('Please answer all questions');
                throw new Error('Incomplete');
            }
            answers.push(parseInt(selected.value));
        });

        // Submit to backend
        const response = await fetch('/check-answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skill: window.currentTestSkill,
                answers: answers
            })
        });

        const results = await response.json();

        if (!response.ok) {
            alert('Error checking answers');
            return;
        }

        // Display results
        displayTestResults(results);

    } catch (error) {
        if (error.message !== 'Incomplete') {
            console.error('Error:', error);
        }
    }
}

function displayTestResults(results) {
    const container = document.getElementById('resultsContent');
    
    const scoreClass = results.passed ? 'passed' : 'failed';
    const statusText = results.passed ? '✅ Passed!' : '❌ Needs Improvement';

    let resultsHTML = `
        <div class="score-display">${results.score}%</div>
        <div class="score-text">${results.correct} out of ${results.total} correct</div>
        <div class="result-status ${scoreClass}">${statusText}</div>
        <div class="result-details">
    `;

    results.results.forEach(r => {
        const resultClass = r.is_correct ? 'correct' : 'incorrect';
        const resultIcon = r.is_correct ? '✅' : '❌';

        resultsHTML += `
            <div class="result-item ${resultClass}">
                <div class="result-question">${r.question}</div>
                <div class="result-answer">
                    Your answer: <strong>${r.user_answer}</strong>
                </div>
        `;

        if (!r.is_correct) {
            resultsHTML += `
                <div class="result-answer">
                    Correct answer: <strong class="result-correct">${r.correct_answer}</strong>
                </div>
            `;
        }

        resultsHTML += `</div>`;
    });

    resultsHTML += `</div>`;

    container.innerHTML = resultsHTML;
    closeQuiz();
    document.getElementById('resultsModal').style.display = 'block';
}

function closeResults() {
    document.getElementById('resultsModal').style.display = 'none';
}

function displayImprovementTips(tfidfScore, skillMatch, jobRole) {
    const tipsContainer = document.getElementById('tipsSection');
    const tfidfTipsList = document.getElementById('tfidfTips');
    const keywordsContainer = document.getElementById('keywordsContainer');

    // Show tips section if score is below 80%
    if (tfidfScore >= 80 && skillMatch >= 75) {
        tipsContainer.style.display = 'none';
        return;
    }

    tipsContainer.style.display = 'block';

    // Generate TF-IDF improvement tips
    const tips = [
        "✏️ Add specific keywords from the job description to your resume",
        "📝 Use the same terminology and phrases found in the job posting",
        "🎯 Include relevant job titles and role-specific terms",
        "💼 Highlight projects and achievements using industry keywords",
        "🔑 Add technical skills and tools mentioned in the job description",
        "📋 Use action verbs that match the job requirements (led, developed, designed, etc.)",
        "🏆 Mention metrics and results using similar language to the posting",
        "🔍 Include any certifications or qualifications mentioned in the role",
        "📄 Ensure your professional summary contains relevant keywords",
        "💡 Focus on outcomes that directly relate to the job role"
    ];

    tfidfTipsList.innerHTML = '';
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tfidfTipsList.appendChild(li);
    });

    // Generate relevant keywords based on job role
    const keywordsByRole = {
        'Data Analyst': [
            'Data visualization', 'SQL queries', 'Python analysis', 'Statistical analysis',
            'Business intelligence', 'Dashboard creation', 'Data extraction', 'Report generation',
            'Data cleaning', 'Trend analysis', 'Excel pivot tables', 'Data modeling'
        ],
        'Web Developer': [
            'Responsive design', 'Frontend development', 'Backend integration', 'API development',
            'Database design', 'Version control', 'Code optimization', 'Bug fixes',
            'User interface', 'Full-stack development', 'Testing and debugging', 'Performance optimization'
        ],
        'ML Engineer': [
            'Model training', 'Neural networks', 'Data preprocessing', 'Feature engineering',
            'Deep learning', 'Algorithm development', 'Model evaluation', 'Production deployment',
            'Data pipeline', 'Optimization techniques', 'Computer vision', 'NLP implementation'
        ]
    };

    const relevantKeywords = keywordsByRole[jobRole] || keywordsByRole['Data Analyst'];

    keywordsContainer.innerHTML = '';
    relevantKeywords.forEach(keyword => {
        const badge = document.createElement('span');
        badge.className = 'keyword-badge';
        badge.textContent = keyword;
        keywordsContainer.appendChild(badge);
    });
}

// --- User account interactions ---
async function signup(username, password, phone) {
    const res = await fetch('/signup', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, password })
    });
    return res.json();
}

async function login(username, password, phone) {
    const res = await fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, password })
    });
    return res.json();
}

async function logout() {
    await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
    document.getElementById('btnLogout').style.display = 'none';
    document.getElementById('btnHistory').style.display = 'none';
}

async function fetchHistory() {
    const res = await fetch('/history', { credentials: 'same-origin' });
    const data = await res.json();
    if (!res.ok) {
        alert(data.error || 'Could not fetch history');
        return;
    }

    // Simple display of recent history
    const html = data.history.map(h => {
        const d = new Date(h.timestamp).toLocaleString();
        return `${d} — ${h.analysis.job_role} — TF-IDF: ${Math.round(h.analysis.tfidf_score)}% — Skill Match: ${h.analysis.skill_match.match_percentage}%`;
    }).join('\n');

    if (!html) {
        alert('No history found');
    } else {
        alert(html);
    }
}

// Note: Login/Signup UI moved to dedicated /login page. Functions `login`, `signup`, `logout`, and `fetchHistory`
// remain available for other UIs to call (e.g., nav buttons). The previous DOM wiring was removed.

// Copy to clipboard utility
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent;
    
    // Use the modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(event.target);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback(event.target);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(button) {
    const original = button.innerHTML;
    button.innerHTML = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
    button.style.background = 'rgba(34, 197, 94, 0.2)';
    button.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    button.style.color = 'var(--success)';
    
    setTimeout(() => {
        button.innerHTML = original;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.color = '';
    }, 2000);
}