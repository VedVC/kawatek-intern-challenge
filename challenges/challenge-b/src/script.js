// Phase 2: Mock Data Injection
// We expanded the JSON to 3 sessions so the charts actually display a trend.
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

// Prepare data arrays for Chart.js
const dates = patientData.sessions.map(s => s.date);
const accuracyData = patientData.sessions.map(s => s.exercises[0].accuracy_percent);
const fatigueData = patientData.sessions.map(s => s.exercises[0].fatigue_index);

// Phase 3: Visualize Data using Chart.js
// Chart 1: Accuracy Trends (Line Chart)
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

// Chart 2: Fatigue Analysis (Bar Chart)
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
    
    // Rule 1: Progression
    if (latest.exercises[0].accuracy_percent >= 75) {
        recommendations.push("🟢 <strong>High Accuracy:</strong> Power Grip accuracy reached 75%. Recommend increasing spring resistance on RYO bionic hand by 1 level.");
    }
    
    // Rule 2: Fatigue monitoring
    if (latest.exercises[0].fatigue_index > 0.4) {
        recommendations.push("🟠 <strong>Fatigue Alert:</strong> Neuromuscular fatigue index is elevated (0.45). Reduce next session duration to 20 minutes to prevent muscle strain.");
    }

    // Rule 3: Quality
    if (latest.emg_quality_score >= 0.85) {
        recommendations.push("🔵 <strong>Signal Quality:</strong> EMG sensor contact is optimal. Good baseline for complex gesture training.");
    }

    return recommendations;
}

// Inject recommendations into the DOM
const ul = document.getElementById('ai-recommendations');
const insights = generateRecommendations(patientData.sessions);

insights.forEach(insight => {
    const li = document.createElement('li');
    li.innerHTML = insight;
    li.className = "flex items-start gap-2 bg-slate-50 p-3 rounded border border-slate-100";
    ul.appendChild(li);
});