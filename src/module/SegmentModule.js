import AbstractAnnotationModule from './AbstractAnnotationModule';
import * as ui from 'waves-ui';

const parameters = {};

class SegmentModule extends AbstractAnnotationModule {
  constructor(options) {
    super(parameters, options);
  }

  createNewAnnotationDatum(time) {
    return {
      time: time,
      label: 'label',
      duration: 1,
    };
  }

  install(block) {
    super.install(block);

    const { timeContext, track } = block.ui;

    const segments = new ui.core.Layer('collection', [], {
      height: block.height,
      yDomain: [0, 1],
    });

    segments.setTimeContext(timeContext);
    segments.configureShape(ui.shapes.Segment, {
      x: (d, v = null) => {
        // can't go beyond the end of the track
        if (v !== null)
          d.time = Math.min(v, timeContext.duration - d.duration);

        return d.time;
      },
      width: (d, v = null) => {
        if (v !== null)
          d.duration = Math.min(v, timeContext.duration - d.time);

        return d.duration;
      },
      y: d => 0,
      height: d => 1,
    }, {
      opacity: 0.2,
      displayHandlers: true,
      handlerWidth: 1,
      handlerOpacity: 0.4,
      displayLabels: true,
    });

    segments.setBehavior(new ui.behaviors.SegmentBehavior());

    track.add(segments);

    this._layer = segments;
    this.postInstall(this._layer);
  }
}

export default SegmentModule;
