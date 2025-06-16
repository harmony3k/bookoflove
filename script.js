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

    // Định nghĩa các hàm khởi tạo JS cho từng trang
    const pageInitializers = {
        'tong-quan': initializeDashboardPage,
    };

    const loadPage = async (pageName) => {
        mainContent.innerHTML = '<p class="text-gray-500 text-center p-10">Đang tải...</p>';
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error('Không tìm thấy trang.');
            
            const content = await response.text();
            mainContent.innerHTML = content;

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

        // Cập nhật trạng thái "active" cho menu
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
        // Cập nhật lại active link khi back/forward
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
// HÀM KHỞI TẠO RIÊNG CHO TRANG TỔNG QUAN
// (Giữ nguyên không đổi)
// ================================================================
function initializeDashboardPage() {
    console.log("Khởi tạo script cho trang Tổng Quan...");
    // ... code khởi tạo biểu đồ ECharts giữ nguyên như trước ...
    // Hàm khởi tạo biểu đồ
    const initChart = (elementId, options) => {
        const chartDom = document.getElementById(elementId);
        if (chartDom) {
            echarts.dispose(chartDom); 
            const myChart = echarts.init(chartDom);
            myChart.setOption(options);
            window.addEventListener('resize', () => myChart.resize());
        }
    };
    const taskOption = { /* ... */ };
    initChart('taskProgressChart', taskOption);
    const guestOption = { /* ... */ };
    initChart('guestChart', guestOption);
}