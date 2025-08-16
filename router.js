document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const content = document.getElementById("content");
  const pageTitle = document.getElementById("page-title");
  const sidebar = document.querySelector("aside");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  
  // Mapeo de rutas a títulos y descripciones
  const routes = {
    '': { 
      title: 'Dashboard', 
      description: 'Vista general del sistema',
      icon: 'tachometer-alt',
      category: 'main'
    },
    'ventas': { 
      title: 'Punto de Venta', 
      description: 'Registro de ventas y pedidos',
      icon: 'cash-register',
      category: 'ventas'
    },
    'mesas': { 
      title: 'Gestión de Mesas', 
      description: 'Estado y reserva de mesas',
      icon: 'chair',
      category: 'ventas'
    },
    'domicilios': { 
      title: 'Domicilios', 
      description: 'Seguimiento de pedidos a domicilio',
      icon: 'truck',
      category: 'ventas'
    },
    'inventario': { 
      title: 'Inventario', 
      description: 'Gestión de productos y suministros',
      icon: 'boxes',
      category: 'inventario'
    },
    'finanzas': { 
      title: 'Finanzas', 
      description: 'Control de ingresos y egresos',
      icon: 'money-bill-wave',
      category: 'finanzas'
    },
    'nomina': { 
      title: 'Nómina', 
      description: 'Gestión de personal y pagos',
      icon: 'users',
      category: 'rrhh'
    },
    'reportes': { 
      title: 'Reportes', 
      description: 'Reportes y análisis',
      icon: 'chart-bar',
      category: 'analisis'
    },
    'estadisticas': { 
      title: 'Estadísticas', 
      description: 'Métricas y análisis',
      icon: 'chart-line',
      category: 'analisis'
    },
    'administracion': { 
      title: 'Administración', 
      description: 'Configuración del sistema',
      icon: 'cog',
      category: 'sistema'
    },
    'extras': { 
      title: 'Extras', 
      description: 'Herramientas y utilidades adicionales',
      icon: 'tools',
      category: 'herramientas'
    }
  };

  // Cargar contenido de la página
  async function loadPage(route) {
    try {
      // Actualizar la URL sin recargar la página
      if (window.location.hash !== `#${route}`) {
        window.history.pushState({}, '', `#${route}`);
      }
      
      // Mostrar título y descripción
      const routeInfo = routes[route] || { title: 'Página no encontrada', description: 'La página solicitada no existe' };
      document.title = `${routeInfo.title} | Sistema Restaurante`;
      pageTitle.textContent = routeInfo.title;
      
      // Cargar contenido específico de la ruta si existe
      try {
        let resp;
        if (route === '' || route === 'dashboard') {
          // Para la ruta raíz o /#dashboard, cargar el dashboard
          resp = await fetch('views/dashboard/index.html');
        } else {
          // Para otras rutas, buscar en la carpeta correspondiente
          resp = await fetch(`views/${route}/index.html`);
        }
        
        if (resp.ok) {
          content.innerHTML = await resp.text();
        } else {
          throw new Error('Página no encontrada');
        }
      } catch (error) {
        // Si no se encuentra la vista, mostrar contenido por defecto
        content.innerHTML = `
          <div class="max-w-7xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">${routeInfo.title}</h2>
              <p class="text-gray-600 dark:text-gray-300">${routeInfo.description}</p>
              ${route === '' ? '<div id="dashboard-widgets" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>' : ''}
            </div>
          </div>
        `;
      }
      
      // Resaltar elemento activo en el menú
      document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === route) {
          link.classList.add('bg-primary-700', 'text-white');
          link.classList.remove('text-white', 'hover:bg-primary-700');
        } else {
          link.classList.remove('bg-primary-700');
          link.classList.add('text-white', 'hover:bg-primary-700');
        }
      });
      
    } catch (error) {
      console.error('Error al cargar la página:', error);
      content.innerHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-300">
                Error al cargar la página: ${error.message}
              </p>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Manejar clic en enlaces del menú
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const route = link.getAttribute('href').substring(1);
      loadPage(route);
    }
  });

  // Manejar botón de toggle del menú lateral
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      sidebar.classList.toggle('md:-translate-x-0');
    });
  }

  // Manejar navegación con los botones de atrás/adelante
  window.addEventListener('popstate', () => {
    const route = window.location.hash.substring(1);
    loadPage(route);
  });

  // Inicializar el router
  function initRouter() {
    const route = window.location.hash.substring(1);
    loadPage(route || '');
  }

  // Iniciar la aplicación
  initRouter();
});
