import * as React from 'react';

interface IProps {
  event: string
  children: (data: any, ) => React.ReactNode
}

interface IState {
  data: any
}

export class Socket extends React.Component<IProps, IState>{
  constructor(props: IProps) {
    super(props);

    this.state = {
      data: null
    }
  }

  public componentWillMount() {
    window.io.on(this.props.event, (data: any) => {
      this.setState({
        data
      })
    });
  }

  public render() {
    if (this.state.data === null) { return null }
    return this.props.children(this.state.data)
  }
}