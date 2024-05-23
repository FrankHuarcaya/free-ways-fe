import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/dashboard',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
                link: '/dashboards/saas',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
                link: '/dashboards/crypto',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
                link: '/dashboards/blog',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARDS.LIST.JOBS',
                link: '/dashboards/jobs',
                parentId: 2,
            },

        ]
    },
    {
        id: 140,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'bx-map',
        subItems: [
            {
                id: 141,
                label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
                link: '/maps/google',
                parentId: 140
            },
            {
                id: 142,
                label: 'MENUITEMS.MAPS.LIST.LEAFLETMAP',
                link: '/maps/leaflet',
                parentId: 140
            },
            {
                id: 142,
                label: 'MENUITEMS.MAPS.LIST.AMCHARTS',
                link: '/maps/AmChart',
                parentId: 140
            },
            {
              id: 143,
              label: 'Prediccion de trafico',
              link: '/maps/flujo_futuro',
              parentId: 2,
            },

        ]
    },

  {
    id: 141,
    label: 'Operaciones',
    icon: 'bx-map',
    subItems: [
      {
        id: 141,
        label: 'Semaforos',
        link: '/operation/traffic-light',
        parentId: 140
      },
      {
        id: 142,
        label: 'Avenidas',
        link: '/operation/avenue',
        parentId: 143
      },
      {
        id: 144,
        label: 'Interseciones',
        link: '/operation/intersection',
        parentId: 145
      }
    ]
  },

];

