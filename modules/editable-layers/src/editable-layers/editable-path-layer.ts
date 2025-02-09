// deck.gl-community
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {PathLayerProps} from '@deck.gl/layers';
import {PathLayer} from '@deck.gl/layers';

import {insertBefore} from '../utils/utils';

interface EditablePathLayerProps extends PathLayerProps<any> {
  pickingLineWidthExtraPixels?: number;
}

const defaultProps = {
  ...PathLayer.defaultProps,
  pickingLineWidthExtraPixels: {type: 'number', min: 0, value: Number.MAX_SAFE_INTEGER}
};

export class EditablePathLayer extends PathLayer<any, EditablePathLayerProps> {
  getShaders() {
    const shaders = super.getShaders();

    shaders.vs = insertBefore(
      shaders.vs,
      'vec3 width;',
      `
       if(bool(picking.isActive)){
        widthPixels.xy += pickingLineWidthExtraPixels;
       }
      `
    );

    return {
      ...shaders,
      inject: {
        ...(shaders.inject || {}),
        'vs:#decl': (shaders.inject?.['vs:#decl'] || '').concat(
          'uniform float pickingLineWidthExtraPixels;'
        )
      }
    };
  }

  draw(props) {
    super.draw({
      ...props,
      uniforms: {
        ...props.uniforms,
        pickingLineWidthExtraPixels: this.props.pickingLineWidthExtraPixels
      }
    });
  }
}

EditablePathLayer.defaultProps = defaultProps;
EditablePathLayer.layerName = 'EditablePathLayer';
