import autobind from 'autobind-decorator';
import classNames from 'classnames';
import filterDOMProps from '../../utils/filterDOMProps';
import PropTypes from 'prop-types';
import React from 'react';

importSpectrumCSS('dropzone');

/**
 * A Dropzone component is an area that accepts drag and drop of files and other objects.
 */
@autobind
export default class Dropzone extends React.Component {
  static defaultProps = {
    dropEffect: 'copy'
  };

  static propTypes = {
    /** Controls the cursor displayed when dragging over the drop zone */
    dropEffect: PropTypes.oneOf(['copy', 'move', 'link', 'none']),

    /** A function that should return a boolean indicating whether a drop is accepted */
    shouldAccept: PropTypes.func,

    /** A callback that is called when dragging over the drop zone */
    onDragOver: PropTypes.func,

    /** A callback that is called when a drop occurs */
    onDrop: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      draggingOver: false
    };
    this.debouncedDragLeave = null;
  }

  clearDebouncedDragLeave() {
    if (this.debouncedDragLeave) {
      clearTimeout(this.debouncedDragLeave);
      this.debouncedDragLeave = null;
    }
  }

  onDragOver(e) {
    if (this.props.shouldAccept && !this.props.shouldAccept()) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.preventDefault();

    this.clearDebouncedDragLeave();

    if (!this.state.draggingOver) {
      this.setState({
        draggingOver: true
      });
    }

    e.dataTransfer.dropEffect = this.props.dropEffect;

    if (this.props.onDragOver) {
      this.props.onDragOver(e);
    }
  }

  onDragLeave(e) {
    this.clearDebouncedDragLeave();

    this.debouncedDragLeave = setTimeout(() => {
      if (this.state.draggingOver) {
        this.setState({
          draggingOver: false
        });
      }

      if (this.props.onDragLeave) {
        this.props.onDragLeave(e);
      }
    }, 100);
  }

  onDrop(e) {
    e.preventDefault();

    this.clearDebouncedDragLeave();

    if (this.state.draggingOver) {
      this.setState({
        draggingOver: false
      });
    }

    if (this.props.onDrop) {
      this.props.onDrop(e);
    }
  }

  render() {
    const {
      children,
      ...otherProps
    } = this.props;

    return (
      <div
        {...filterDOMProps(otherProps)}
        className={classNames(
          'spectrum-Dropzone',
          {
            'is-dragged': this.state.draggingOver
          }
        )}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}>
        {children}
      </div>
    );
  }
}