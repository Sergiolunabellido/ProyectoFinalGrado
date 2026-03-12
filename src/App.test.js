import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

let mockCurrentPath = '/';

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');
    /**
     * @brief Actualiza la ruta simulada para los tests.
     * @fecha 2026-03-10
     * @returns {void} No devuelve nada.
     */
    const setPath = (path) => {
      mockCurrentPath = path;
    };

    /**
     * @brief Comprueba si una ruta coincide con el path actual.
     * @fecha 2026-03-10
     * @returns {boolean} True si coincide, false si no.
     */
    const matchPath = (routePath, path) => {
      if (routePath === path) return true;
      if (!routePath) return false;
      if (routePath.includes(':')) {
        const base = routePath.split('/:')[0];
        return path.startsWith(base + '/');
      }
      return false;
    };

    return {
      /**
       * @brief Router simulado para pruebas.
       * @fecha 2026-03-10
       * @returns {JSX.Element} Contenedor con hijos.
       */
      MemoryRouter: ({ initialEntries, children }) => {
        if (initialEntries && initialEntries[0]) setPath(initialEntries[0]);
        return <div>{children}</div>;
      },
      /**
       * @brief Renderiza la ruta que coincide.
       * @fecha 2026-03-10
       * @returns {JSX.Element|null} Elemento de ruta o null.
       */
      Routes: ({ children }) => {
        const list = React.Children.toArray(children);
        const match = list.find((child) => matchPath(child.props.path, mockCurrentPath));
        return match ? match.props.element : null;
      },
      /**
       * @brief Devuelve el elemento de ruta.
       * @fecha 2026-03-10
       * @returns {JSX.Element} Elemento de ruta.
       */
      Route: ({ element }) => element,
      __setPath: setPath,
    };
  },
  { virtual: true }
);

jest.mock('./Pages/Principal/principal', () => () => <div data-testid="page-principal" />);
jest.mock('./Pages/Login/login', () => () => <div data-testid="page-login" />);
jest.mock('./Pages/Perfil/perfil', () => () => <div data-testid="page-perfil" />);
jest.mock('./Pages/Catalogo/catalogo', () => () => <div data-testid="page-catalogo" />);
jest.mock('./Pages/Carrito/carrito', () => () => <div data-testid="page-carrito" />);
jest.mock('./Pages/Libros/paginaLibro', () => () => <div data-testid="page-libro" />);

describe('App routing', () => {
  /**
   * @brief Renderiza la app en una ruta concreta.
   * @fecha 2026-03-10
   * @returns {ReturnType<render>} Resultado del render.
   */
  const renderAt = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );

  test('route / renders Principal', () => {
    renderAt('/');
    expect(screen.getByTestId('page-principal')).toBeInTheDocument();
  });

  test('route /login renders Login', () => {
    renderAt('/login');
    expect(screen.getByTestId('page-login')).toBeInTheDocument();
  });

  test('route /perfil renders Perfil', () => {
    renderAt('/perfil');
    expect(screen.getByTestId('page-perfil')).toBeInTheDocument();
  });

  test('route /catalogo renders Catalogo', () => {
    renderAt('/catalogo');
    expect(screen.getByTestId('page-catalogo')).toBeInTheDocument();
  });

  test('route /carrito renders Carrito', () => {
    renderAt('/carrito');
    expect(screen.getByTestId('page-carrito')).toBeInTheDocument();
  });

  test('route /libro/:id renders PageBook', () => {
    renderAt('/libro/123');
    expect(screen.getByTestId('page-libro')).toBeInTheDocument();
  });
});
