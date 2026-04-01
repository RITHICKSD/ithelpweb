document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Setup
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.admin-view');
    const viewTitle = document.getElementById('view-title');
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleSidebar(forceOpen) {
        const isOpen = (forceOpen !== undefined) ? forceOpen : !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', isOpen);
        if (sidebarOverlay) sidebarOverlay.classList.toggle('open', isOpen);
        if (sidebarToggle) {
            sidebarToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    }

    function switchView(viewId) {
        // Toggle Nav Items
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
                if (viewTitle) viewTitle.textContent = item.textContent.trim();
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle View Panes
        views.forEach(view => {
            if (view.id === 'view-' + viewId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Initialize Charts for that view
        initChartsForView(viewId);

        // Close Sidebar on Mobile
        if (window.innerWidth <= 1024) {
            toggleSidebar(false);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const viewId = item.getAttribute('data-view');
            if (viewId) switchView(viewId);
        });
    });

    // 2. Mobile Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => toggleSidebar());
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
    }

    // 3. Chart Management
    const activeCharts = {};

    function initChartsForView(viewId) {
        // Global Chart options
        const globalOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: { color: '#718096', font: { family: 'Outfit, sans-serif' } }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#718096' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#718096' }
                }
            }
        };

        const doughnutOptions = {
            ...globalOptions,
            scales: { x: { display: false }, y: { display: false } },
            plugins: { legend: { display: true, position: 'bottom', labels: { color: '#718096' } } },
            cutout: '75%'
        };

        if (viewId === 'overview') {
            renderChart('chart-overview-main', 'line', {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Bandwidth',
                    data: [35, 25, 65, 85, 45, 95],
                    borderColor: '#D4AF37',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(212, 175, 55, 0.05)'
                }]
            }, globalOptions);

            renderChart('chart-overview-dist', 'doughnut', {
                labels: ['North America', 'EMEA', 'APAC'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#D4AF37', '#e2e8f0', '#2d3748'],
                    borderWidth: 0
                }]
            }, doughnutOptions);
        }

        if (viewId === 'users') {
          renderChart('chart-users-growth', 'bar', {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'New Entities',
              data: [120, 190, 150, 240, 210, 310],
              backgroundColor: '#D4AF37',
              borderRadius: 8
            }]
          }, globalOptions);

          renderChart('chart-users-dept', 'polarArea', {
            labels: ['Engineering', 'Marketing', 'Core Ops', 'Sales'],
            datasets: [{
              data: [40, 20, 25, 15],
              backgroundColor: ['rgba(212, 175, 55, 0.4)', 'rgba(59, 130, 246, 0.4)', 'rgba(16, 185, 129, 0.4)', 'rgba(139, 92, 246, 0.4)'],
              borderWidth: 0
            }]
          }, { ...globalOptions, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' } } } });
        }

        if (viewId === 'tickets') {
          renderChart('chart-tickets-perf', 'line', {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Resolution Rate (min)',
              data: [45, 32, 58, 42, 38, 55, 48],
              borderColor: '#D4AF37',
              tension: 0.3,
              fill: false
            }]
          }, globalOptions);
        }

        if (viewId === 'infrastructure') {
          renderChart('chart-infra-load', 'line', {
            labels: ['T-60', 'T-45', 'T-30', 'T-15', 'Now'],
            datasets: [{
              label: 'CPU %',
              data: [42, 45, 88, 52, 62],
              borderColor: '#10B981',
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
              backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }]
          }, globalOptions);

          renderChart('chart-infra-storage', 'pie', {
            labels: ['Used', 'Idle', 'Reserved'],
            datasets: [{
              data: [62, 28, 10],
              backgroundColor: ['rgba(212, 175, 55, 0.6)', 'rgba(10, 185, 129, 0.6)', 'rgba(59, 130, 246, 0.6)'],
              borderWidth: 0
            }]
          }, doughnutOptions);
        }

        if (viewId === 'security') {
          renderChart('chart-security-threats', 'bar', {
            labels: ['00', '04', '08', '12', '16', '20'],
            datasets: [{
              label: 'DDoS Blocked',
              data: [420, 280, 560, 890, 640, 410],
              backgroundColor: (ctx) => {
                const colors = ['rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.4)'];
                return ctx.dataIndex % 2 === 0 ? colors[0] : colors[1];
              },
              borderRadius: 6
            }]
          }, globalOptions);

          renderChart('chart-security-vuln', 'doughnut', {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
              data: [0, 2, 15, 83],
              backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
              borderWidth: 0
            }]
          }, doughnutOptions);
        }

        if (viewId === 'financials') {
          renderChart('chart-financials-main', 'line', {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
              {
                label: 'Revenue',
                data: [5.2, 6.8, 7.5, 8.4],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
              },
              {
                label: 'OPEX',
                data: [3.1, 3.4, 3.2, 3.5],
                borderColor: '#EF4444',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4
              }
            ]
          }, { ...globalOptions, plugins: { legend: { display: true, labels: { color: '#718096' } } } });

          renderChart('chart-financials-dist', 'pie', {
            labels: ['Infrastructure', 'Personnel', 'Licensing', 'Misc'],
            datasets: [{
              data: [40, 35, 15, 10],
              backgroundColor: ['#D4AF37', '#3B82F6', '#10B981', '#718096'],
              borderWidth: 0
            }]
          }, doughnutOptions);
        }

        if (viewId === 'projects') {
          renderChart('chart-projects-milestones', 'bar', {
            labels: ['Alpha', 'Beta', 'v1.0', 'v1.1', 'v2.0'],
            datasets: [{
              label: 'Milestones Completed',
              data: [100, 100, 85, 40, 10],
              backgroundColor: '#D4AF37',
              borderRadius: 8
            }]
          }, globalOptions);

          renderChart('chart-projects-workload', 'radar', {
            labels: ['Dev', 'Design', 'QA', 'Ops', 'Management'],
            datasets: [{
              label: 'Utilization %',
              data: [95, 80, 70, 85, 60],
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              borderColor: '#D4AF37',
              pointBackgroundColor: '#D4AF37'
            }]
          }, { 
              ...globalOptions, 
              scales: { 
                  r: { 
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      angleLines: { color: 'rgba(255,255,255,0.05)' },
                      pointLabels: { color: '#718096' },
                      ticks: { display: false }
                  } 
              } 
          });
        }
    }

    function renderChart(canvasId, type, data, options) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (activeCharts[canvasId]) {
            activeCharts[canvasId].destroy();
        }

        activeCharts[canvasId] = new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
    }

    // 4. Initial view
    initChartsForView('overview');
    lucide.createIcons();
});
