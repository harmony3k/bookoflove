// script.js (ĐÃ SỬA LỖI)

// Hàm khởi tạo tương tác cho sidebar
function initializeSidebarInteractions() {
    const sidebar = document.querySelector('.sidebar');
    // Lấy TẤT CẢ các nút gạt (cả trên desktop và mobile)
    const sidebarTogglers = document.querySelectorAll('.sidebar-toggler');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar && sidebarTogglers.length > 0) {
        // Gắn sự kiện cho mỗi nút
        sidebarTogglers.forEach(toggler => {
            toggler.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        });
    }

    // Thêm sự kiện để đóng sidebar khi click vào lớp phủ
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Hàm xử lý logic chính của ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo tương tác cho sidebar ngay lập tức
    initializeSidebarInteractions();
    
    const mainContent = document.getElementById('main-content');
    const menuList = document.querySelector('.menu-list');

    // Ánh xạ tên trang với hàm khởi tạo JavaScript tương ứng
    const pageInitializers = {
        'tong-quan': initializeTongQuanPage,
        'su-kien': initializeSuKienPage,
        // 'cong-viec': initializeCongViecPage,
    };

    const loadPage = async (pageName) => {
        mainContent.innerHTML = '<p class="text-gray-500 text-center p-10">Đang tải...</p>';
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error(`Không tìm thấy trang: ${pageName}.html`);
            
            const content = await response.text();
            mainContent.innerHTML = content;

            // Sau khi tải HTML, gọi hàm JS tương ứng với trang đó
            if (pageInitializers[pageName]) {
                pageInitializers[pageName]();
            }
        } catch (error) {
            mainContent.innerHTML = `<p class="text-red-500 text-center p-10">Lỗi: ${error.message}</p>`;
            console.error(error);
        }
    };

    const handleNavigation = (e) => {
        const targetLink = e.target.closest('.nav-link');
        if (!targetLink) return;

        e.preventDefault();
        const pageName = targetLink.dataset.page;
        if (!pageName) return;

        // Đóng sidebar trên mobile sau khi click
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar')?.classList.remove('active');
        }

        history.pushState({ page: pageName }, '', `#${pageName}`);

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        targetLink.classList.add('active');

        loadPage(pageName);
    };
    
    if (menuList) {
        menuList.addEventListener('click', handleNavigation);
    }

    window.addEventListener('popstate', (e) => {
        const pageName = (e.state && e.state.page) || window.location.hash.substring(1) || 'tong-quan';
        loadPage(pageName);
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });
    });

    // Tải trang ban đầu
    const initialPage = window.location.hash.substring(1) || 'tong-quan';
    loadPage(initialPage);
    const activeLink = document.querySelector(`.nav-link[data-page="${initialPage}"]`);
    if (activeLink) activeLink.classList.add('active');
});


// ================================================================
// HÀM KHỞI TẠO CHO TRANG TỔNG QUAN
// ================================================================
function initializeTongQuanPage() {
    console.log("Khởi tạo script cho trang Tổng Quan...");
    
    // Hàm khởi tạo biểu đồ chung
    const initChart = (elementId, options) => {
        const chartDom = document.getElementById(elementId);
        if (chartDom) {
            setTimeout(() => {
                echarts.dispose(chartDom);
                const myChart = echarts.init(chartDom);
                myChart.setOption(options);
                new ResizeObserver(() => myChart.resize()).observe(chartDom.parentElement);
            }, 0);
        } else {
            console.error(`Không tìm thấy phần tử biểu đồ với ID: ${elementId}`);
        }
    };

    // 1. Task Progress Chart Options
    const taskProgressChartOptions = {
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', right: 10, top: 'center', data: ['Đã hoàn thành', 'Đang thực hiện', 'Chưa bắt đầu'] },
        series: [{
            name: 'Tiến độ công việc', type: 'pie', radius: ['50%', '70%'],
            avoidLabelOverlap: false, label: { show: false }, emphasis: { label: { show: false } }, labelLine: { show: false },
            data: [
                { value: 30, name: 'Đã hoàn thành', itemStyle: { color: '#22c55e' } },
                { value: 45, name: 'Đang thực hiện', itemStyle: { color: '#f59e0b' } },
                { value: 25, name: 'Chưa bắt đầu', itemStyle: { color: '#d1d5db' } }
            ]
        }]
    };
    initChart('taskProgressChart', taskProgressChartOptions);

    // 2. Budget Chart Options
    const budgetChartOptions = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
            const value = new Intl.NumberFormat('vi-VN').format(params[0].value * 1000000);
            return `${params[0].name}<br/>${params[0].marker} ${value} đ`;
        }},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: [{ type: 'category', data: ['Tổng ngân sách', 'Đã chi', 'Còn lại'], axisTick: { alignWithLabel: true } }],
        yAxis: [{ type: 'value', axisLabel: { formatter: '{value}tr' } }],
        series: [{
            name: 'Ngân sách', type: 'bar', barWidth: '60%',
            data: [
                { value: 100, itemStyle: { color: '#3b82f6' } },
                { value: 35, itemStyle: { color: '#ef4444' } },
                { value: 65, itemStyle: { color: '#22c55e' } }
            ],
            itemStyle: { borderRadius: 4 }
        }]
    };
    initChart('budgetChart', budgetChartOptions);

    // 3. Guest Chart Options
    const guestChartOptions = {
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { show: false },
        series: [{
            name: 'Khách mời', type: 'pie', radius: ['40%', '70%'],
            avoidLabelOverlap: false, label: { show: false }, labelLine: { show: false },
            data: [
                { value: 120, name: 'Đã xác nhận', itemStyle: { color: '#22c55e' } },
                { value: 80, name: 'Chờ xác nhận', itemStyle: { color: '#f59e0b' } }
            ]
        }]
    };
    initChart('guestChart', guestChartOptions);
}


// ================================================================
// HÀM KHỞI TẠO CHO TRANG SỰ KIỆN
// ================================================================
function initializeSuKienPage() {
    console.log("Khởi tạo script cho trang Sự Kiện...");

    // ... code cho trang Sự Kiện giữ nguyên ...
    // ---- LOGIC MODAL ----
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    const closeAddEventModal = document.getElementById('closeAddEventModal');
    if(addEventBtn) addEventBtn.addEventListener('click', () => addEventModal.classList.remove('hidden'));
    if(closeAddEventModal) closeAddEventModal.addEventListener('click', () => addEventModal.classList.add('hidden'));

    const viewDetailBtns = document.querySelectorAll('.viewDetailBtn');
    const eventDetailModal = document.getElementById('eventDetailModal');
    const closeEventDetailModal = document.getElementById('closeEventDetailModal');
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            eventDetailModal.classList.remove('hidden');
        });
    });
    if(closeEventDetailModal) closeEventDetailModal.addEventListener('click', () => eventDetailModal.classList.add('hidden'));
    
    // ... các logic khác
}
