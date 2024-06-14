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
                parentId: 2,
                roles: ['admin','analyst']  // Suponiendo que los usuarios también tienen acceso

            }
        ],
      roles: ['admin','analyst']  // Suponiendo que los usuarios también tienen acceso
    },
    {
        id: 140,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'bx-map',
        subItems: [
            {
                id: 141,
                label: 'Monitoreo tiempo Real',
                link: '/maps/google',
                parentId: 140,
                roles: ['monitor','analyst','admin']
            },
            {
              id: 142,
              label: 'Prediccion de trafico',
              link: '/maps/flujo_futuro',
              parentId: 140,
              roles: ['monitor','analyst','admin']
            },

        ],
      roles: ['admin','monitor','analyst']

    },

  {
    id: 141,
    label: 'Operaciones',
    icon: 'bx bx-buoy',
    subItems: [
      {
        id: 141,
        label: 'Semaforos',
        link: '/operation/traffic-light',
        parentId: 140,
        roles: ['admin']
      },
      {
        id: 142,
        label: 'Avenidas',
        link: '/operation/avenue',
        parentId: 143,
        roles: ['admin']
      },
      {
        id: 144,
        label: 'Interseciones',
        link: '/operation/intersection',
        parentId: 145,
        roles: ['admin']
      },
      {
            id: 146,
            label: 'Grupo carriles',
            link: '/operation/lane-group',
            parentId: 147,
            roles: ['admin']
      },
      {
        id: 147,
        label: 'Flujo trafico',
        link: '/operation/traffic-flow',
        parentId: 148,
        roles: ['admin']
      },
        {
            id: 149,
            label: 'Usuario',
            link: '/operation/user',
            parentId: 150,
            roles: ['admin']
        }
    ],
    roles: ['admin']
  },

];

