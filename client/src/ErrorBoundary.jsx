import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in error boundary:", error, errorInfo);
  }

  render() {
    console.log("this.state",this.state);
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    console.log("this.props.children",this.props.children);
    return this.props.children;
  }
}

export default ErrorBoundary;
