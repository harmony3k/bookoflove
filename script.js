// script.js

// Hàm khởi tạo tương tác cho sidebar
function initializeSidebarInteractions() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = document.querySelector('.sidebar-toggler');

    if (sidebar && sidebarToggler) {
        sidebarToggler.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Hàm xử lý logic chính của ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo tương tác cho sidebar ngay lập tức
    initializeSidebarInteractions();
    
    const mainContent = document.getElementById('main-content');
    const menuList = document.querySelector('.menu-list');

    // =======================================================================
    // QUAN TRỌNG: ÁNH XẠ TÊN TRANG VỚI HÀM KHỞI TẠO JAVASCRIPT TƯƠNG ỨNG
    // =======================================================================
    const pageInitializers = {
        'tong-quan': initializeTongQuanPage,
        'su-kien': initializeSuKienPage,
        // Thêm các trang khác ở đây, ví dụ:
        // 'cong-viec': initializeCongViecPage,
    };

    const loadPage = async (pageName) => {
        mainContent.innerHTML = '<p class="text-gray-500 text-center p-10">Đang tải...</p>';
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error('Không tìm thấy trang.');
            
            const content = await response.text();
            mainContent.innerHTML = content;

            // Sau khi tải HTML, gọi hàm JS tương ứng với trang đó
            if (pageInitializers[pageName]) {
                pageInitializers[pageName]();
            }
        } catch (error) {
            mainContent.innerHTML = `<p class="text-red-500 text-center p-10">Lỗi: ${error.message}</p>`;
        }
    };

    const handleNavigation = (e) => {
        const targetLink = e.target.closest('.nav-link');
        if (!targetLink) return;

        e.preventDefault();
        const pageName = targetLink.dataset.page;
        if (!pageName) return;

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
            echarts.dispose(chartDom);
            const myChart = echarts.init(chartDom);
            myChart.setOption(options);
            // Quan trọng: Phải có listener resize ở đây vì window là đối tượng toàn cục
            new ResizeObserver(() => myChart.resize()).observe(chartDom.parentElement);
        }
    };

    // Task Progress Chart
    const taskProgressChartOptions = { /* ... Copy options từ file HTML cũ ... */ };
    initChart('taskProgressChart', taskProgressChartOptions);

    // Budget Chart
    const budgetChartOptions = { /* ... Copy options từ file HTML cũ ... */ };
    initChart('budgetChart', budgetChartOptions);

    // Guest Chart
    const guestChartOptions = { /* ... Copy options từ file HTML cũ ... */ };
    initChart('guestChart', guestChartOptions);
}


// ================================================================
// HÀM KHỞI TẠO CHO TRANG SỰ KIỆN
// ================================================================
function initializeSuKienPage() {
    console.log("Khởi tạo script cho trang Sự Kiện...");

    // ---- LOGIC DROPDOWN ----
    const statusFilterBtn = document.getElementById('statusFilterBtn');
    const statusFilterDropdown = document.getElementById('statusFilterDropdown');
    if(statusFilterBtn) {
        statusFilterBtn.addEventListener('click', () => statusFilterDropdown.classList.toggle('hidden'));
    }
    const timeFilterBtn = document.getElementById('timeFilterBtn');
    const timeFilterDropdown = document.getElementById('timeFilterDropdown');
    if(timeFilterBtn) {
        timeFilterBtn.addEventListener('click', () => timeFilterDropdown.classList.toggle('hidden'));
    }
    // ... logic còn lại cho dropdown

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
            // Logic mở modal chi tiết
            eventDetailModal.classList.remove('hidden');
        });
    });
    if(closeEventDetailModal) closeEventDetailModal.addEventListener('click', () => eventDetailModal.classList.add('hidden'));
    
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if(deleteEventBtn) deleteEventBtn.addEventListener('click', () => deleteConfirmModal.classList.remove('hidden'));
    if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.classList.add('hidden'));

    // ---- LOGIC TABS ----
    const tabs = document.querySelectorAll('.eventDetailTab');
    const tabContents = document.querySelectorAll('.eventDetailTabContent');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('border-primary', 'text-primary'));
            this.classList.add('border-primary', 'text-primary');
            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(tabId + 'Tab').classList.remove('hidden');
        });
    });

    // ---- LOGIC CHARTS ----
    const initChart = (elementId, options) => {
        const chartDom = document.getElementById(elementId);
        if (chartDom) {
            echarts.dispose(chartDom);
            const myChart = echarts.init(chartDom);
            myChart.setOption(options);
            new ResizeObserver(() => myChart.resize()).observe(chartDom.parentElement);
        }
    };
    
    // Vendor Chart
    const vendorOption = {
        series: [{
            name: 'Nhà cung cấp', type: 'pie', radius: ['40%', '70%'],
            data: [
                { value: 5, name: 'Đã chốt', itemStyle: { color: '#22c55e' } },
                { value: 3, name: 'Đang cân nhắc', itemStyle: { color: '#f59e0b' } },
                { value: 4, name: 'Cần tìm', itemStyle: { color: '#a855f7' } }
            ]
        }] // ... các options khác
    };
    initChart('vendorChart', vendorOption);

    // Budget Chart
    const budgetOption = {
        series: [{
            name: 'Phân bổ chi phí', type: 'pie', radius: '70%',
            data: [
                { value: 12, name: 'Trang trí', itemStyle: { color: '#3b82f6' } },
                { value: 45, name: 'Ẩm thực', itemStyle: { color: '#22c55e' } },
                { value: 7, name: 'Trang phục', itemStyle: { color: '#f59e0b' } },
                { value: 8, name: 'Hình ảnh', itemStyle: { color: '#ef4444' } },
                { value: 5, name: 'Giải trí', itemStyle: { color: '#a855f7' } },
                { value: 23, name: 'Khác', itemStyle: { color: '#6b7280' } }
            ]
        }] // ... các options khác
    };
    initChart('budgetChart', budgetOption);
}