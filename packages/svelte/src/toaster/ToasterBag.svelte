<script>
  import { DEFAULT_ANIMATION_DURATION, DEFAULT_DURATION } from './constants';
  import { notifications, dismiss } from './store';
  import ToastWrapper from './ToastWrapper.svelte';

  type XPosition = 'right' | 'left' | 'center';

  type YPosition = 'top' | 'bottom';

  export let x: XPosition = 'right';
  export let y: YPosition = 'bottom';
</script>

<div class={['bag', x, y].join(' ')}>
  {#each $notifications as { Component, id, duration = DEFAULT_DURATION, animationDuration = DEFAULT_ANIMATION_DURATION, ...forwardedProps } (id)}
    <ToastWrapper
      dismiss={() => dismiss(id)}
      let:percentage
      {duration}
      {animationDuration}
    >
      <svelte:component
        this={Component}
        {...forwardedProps}
        {percentage}
        dismiss={() => dismiss(id)}
      />
    </ToastWrapper>
  {/each}
</div>

<style>
  .bag {
    padding: 1rem;
    position: fixed;
    z-index: 99999;
  }

  .bag.right {
    right: 0;
  }

  .bag.left {
    left: 0;
  }

  .bag.bottom {
    bottom: 0;
  }

  .bag.center {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
