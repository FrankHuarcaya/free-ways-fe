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
            }
        ]
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
                parentId: 140
            },
            {
              id: 142,
              label: 'Prediccion de trafico',
              link: '/maps/flujo_futuro',
              parentId: 140,
            },

        ]
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
      },
      {
            id: 146,
            label: 'Grupo carriles',
            link: '/operation/lane-group',
            parentId: 147
      },
      {
        id: 147,
        label: 'Flujo trafico',
        link: '/operation/traffic-flow',
        parentId: 148
      },
        {
            id: 149,
            label: 'Usuario',
            link: '/operation/user',
            parentId: 150
        }
    ]
  },

];

