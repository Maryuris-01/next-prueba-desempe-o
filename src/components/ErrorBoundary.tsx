import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

// Captura errores de renderizado en el árbol que envuelve (no errores de fetch,
// esos ya se manejan con try/catch en cada llamada a la API).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary capturó un error de renderizado:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>{this.state.message ?? 'Ocurrió un error inesperado al mostrar esta sección.'}</p>
          <button onClick={this.handleReload}>Recargar página</button>
        </div>
      );
    }
    return this.props.children;
  }
}