// Phase 1: Mock Data Injection
const patientData = {
    "patient_id": "RYO-2027-001",
    "sessions": [
        {
            "date": "2027-07-08",
            "duration_minutes": 30,
            "exercises": [{ "name": "Power Grip", "accuracy_percent": 65, "fatigue_index": 0.2 }],
            "emg_quality_score": 0.82,
            "overall_progress_percent": 35
        },
        {
            "date": "2027-07-09",
            "duration_minutes": 35,
            "exercises": [{ "name": "Power Grip", "accuracy_percent": 70, "fatigue_index": 0.35 }],
            "emg_quality_score": 0.84,
            "overall_progress_percent": 40
        },
        {
            "date": "2027-07-10",
            "duration_minutes": 30,
            "exercises": [{ "name": "Power Grip", "accuracy_percent": 75, "fatigue_index": 0.45 }],
            "emg_quality_score": 0.85,
            "overall_progress_percent": 45
        }
    ]
};

// Phase 2: Populate the UI Skeleton
document.getElementById('patient-id').textContent = patientData.patient_id;
document.getElementById('total-sessions').textContent = patientData.sessions.length;

// Get latest session for current progress
const latestSession = patientData.sessions[patientData.sessions.length - 1];
document.getElementById('overall-progress').textContent = `${latestSession.overall_progress_percent}%`;

// Calculate Average EMG Quality
const totalEmg = patientData.sessions.reduce((sum, session) => sum + session.emg_quality_score, 0);
const avgEmg = (totalEmg / patientData.sessions.length).toFixed(2);
document.getElementById('avg-emg').textContent = avgEmg;


// Phase 3: Visualize Data using Chart.js
const dates = patientData.sessions.map(s => s.date);
const accuracyData = patientData.sessions.map(s => s.exercises[0].accuracy_percent);
const fatigueData = patientData.sessions.map(s => s.exercises[0].fatigue_index);

// Chart 1: Accuracy Trends
new Chart(document.getElementById('progressChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: 'Power Grip Accuracy (%)',
            data: accuracyData,
            borderColor: '#0284c7', // Tailwind sky-600
            tension: 0.3,
            fill: false
        }]
    },
    options: { responsive: true }
});

// Chart 2: Fatigue Analysis
new Chart(document.getElementById('fatigueChart'), {
    type: 'bar',
    data: {
        labels: dates,
        datasets: [{
            label: 'Fatigue Index',
            data: fatigueData,
            backgroundColor: '#f43f5e', // Tailwind rose-500
        }]
    },
    options: { responsive: true }
});


// Phase 4: AI Recommendations (Rule-based engine)
function generateRecommendations(sessions) {
    const recommendations = [];
    const latest = sessions[sessions.length - 1];
    
    // Progression
    if (latest.exercises[0].accuracy_percent >= 75) {
        recommendations.push("🟢 <strong>High Accuracy:</strong> Power Grip accuracy reached 75%. Recommend increasing spring resistance on RYO bionic hand by 1 level.");
    }
    // Fatigue monitoring
    if (latest.exercises[0].fatigue_index > 0.4) {
        recommendations.push("🟠 <strong>Fatigue Alert:</strong> Neuromuscular fatigue index is elevated (0.45). Reduce next session duration to 20 minutes to prevent muscle strain.");
    }
    // Quality
    if (latest.emg_quality_score >= 0.85) {
        recommendations.push("🔵 <strong>Signal Quality:</strong> EMG sensor contact is optimal. Good baseline for complex gesture training.");
    }

    return recommendations;
}

const ul = document.getElementById('ai-recommendations');
const insights = generateRecommendations(patientData.sessions);

insights.forEach(insight => {
    const li = document.createElement('li');
    li.innerHTML = insight;
    li.className = "flex items-start gap-2 bg-slate-50 p-3 rounded border border-slate-100";
    ul.appendChild(li);
});


// Phase 5: Detailed Session Log (Interactive Accordions)
const historyContainer = document.getElementById('session-history');

// Clone and reverse array so the most recent session is at the top
const reversedSessions = [...patientData.sessions].reverse();

reversedSessions.forEach((session, index) => {
    // Calculate actual session number
    const sessionNumber = patientData.sessions.length - index;
    
    const historyCard = document.createElement('div');
    historyCard.className = "border border-slate-200 rounded-lg bg-white overflow-hidden transition-all duration-200 hover:border-blue-300";
    
    // Build HTML for each card with inline onclick to toggle the 'hidden' class
    historyCard.innerHTML = `
        <div class="p-4 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-blue-50 transition-colors" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <div class="flex items-center gap-4">
                <div class="bg-blue-100 text-blue-700 font-bold py-2 px-3 rounded-md text-center min-w-[60px]">
                    ${session.date.split('-').slice(1).join('/')}
                </div>
                <div>
                    <p class="font-bold text-slate-800">Session ${sessionNumber}</p>
                    <p class="text-sm text-slate-500 font-medium">${session.duration_minutes} Min • EMG Score: ${session.emg_quality_score}</p>
                </div>
            </div>
            <div class="text-blue-600 font-semibold text-sm flex items-center gap-1">
                View Details ▾
            </div>
        </div>
        
        <!-- Expandable Details Section (Hidden by default) -->
        <div class="hidden p-4 border-t border-slate-200 bg-white">
            <h4 class="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Exercise Breakdown</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${session.exercises.map(ex => `
                    <div class="bg-slate-50 p-3 rounded border border-slate-100">
                        <p class="text-xs text-slate-500 font-semibold mb-1">${ex.name} Acc.</p>
                        <p class="text-xl font-bold text-slate-800">${ex.accuracy_percent}%</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded border border-slate-100">
                        <p class="text-xs text-slate-500 font-semibold mb-1">Fatigue Index</p>
                        <p class="text-xl font-bold ${ex.fatigue_index > 0.4 ? 'text-rose-600' : 'text-slate-800'}">${ex.fatigue_index}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    historyContainer.appendChild(historyCard);
});