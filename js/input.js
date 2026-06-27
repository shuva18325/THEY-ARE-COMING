/* ===== THEY ARE COMING — input (WASD + mouse, right-click fires) ===== */
(function (T) {
  'use strict';
  const I = {
    keys: {},
    mouse: { x: 480, y: 300, sx: 0, sy: 0 }, // sx/sy = screen-space within canvas
    firing: false,        // right mouse held (shoot)
    stabbing: false,      // left mouse held (melee)
    pressed: {},          // edge-triggered this frame
    canvas: null,
  };
  T.Input = I;

  I.init = function (canvas) {
    I.canvas = canvas;

    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (!I.keys[k]) I.pressed[k] = true;
      I.keys[k] = true;
      if ([' ', 'tab'].includes(k)) e.preventDefault();
      T.Audio.unlock();
    });
    window.addEventListener('keyup', e => { I.keys[e.key.toLowerCase()] = false; });

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      I.mouse.sx = (e.clientX - r.left) * (canvas.width / r.width);
      I.mouse.sy = (e.clientY - r.top) * (canvas.height / r.height);
    });
    // RIGHT-CLICK = fire weapon.  LEFT-CLICK = melee / stab.
    canvas.addEventListener('mousedown', e => {
      T.Audio.unlock();
      if (e.button === 2) { I.firing = true; e.preventDefault(); }
      else if (e.button === 0) { I.stabbing = true; e.preventDefault(); }
    });
    window.addEventListener('mouseup', e => {
      if (e.button === 2) I.firing = false;
      else if (e.button === 0) I.stabbing = false;
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('blur', () => { I.keys = {}; I.firing = false; I.stabbing = false; });
  };

  // movement vector (normalized)
  I.moveVec = function () {
    let dx = 0, dy = 0;
    if (I.keys['w'] || I.keys['arrowup']) dy -= 1;
    if (I.keys['s'] || I.keys['arrowdown']) dy += 1;
    if (I.keys['a'] || I.keys['arrowleft']) dx -= 1;
    if (I.keys['d'] || I.keys['arrowright']) dx += 1;
    if (dx && dy) { const inv = 0.70710678; dx *= inv; dy *= inv; }
    return { x: dx, y: dy };
  };

  I.justPressed = k => !!I.pressed[k];
  I.endFrame = () => { I.pressed = {}; };

})(window.TAC);
