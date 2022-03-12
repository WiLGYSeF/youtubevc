type Arrangement = HTMLElement[][];

function isArrangementEqual(a: Arrangement, b: Arrangement): boolean {
  let changed = a.length !== b.length;

  for (let i = 0; !changed && i < a.length; i += 1) {
    if (a[i].length !== b[i].length) {
      changed = true;
      break;
    }

    for (let j = 0; j < a[i].length; j += 1) {
      if (a[i][j] !== b[i][j]) {
        changed = true;
        break;
      }
    }
  }

  return changed;
}

function getArrangement(container: HTMLElement): Arrangement {
  const arrangement: HTMLElement[][] = [];
  let row: HTMLElement[] = [];
  let currentTop: number = 0;

  Array.prototype.forEach.call(container.children, (e: HTMLElement) => {
    const rect = e.getBoundingClientRect();
    if (rect.top !== currentTop) {
      if (row.length) {
        arrangement.push(row);
      }
      row = [e];
      currentTop = rect.top;
    } else {
      row.push(e);
    }
  });
  if (row.length) {
    arrangement.push(row);
  }

  return arrangement;
}

export default function wrapDetect(
  container: HTMLElement,
  onChange: (arrangement: Arrangement, lastArrangement: Arrangement) => void,
): Function {
  let lastArrangement: Arrangement = [];

  const action = () => {
    const arrangement = getArrangement(container);

    if (!isArrangementEqual(arrangement, lastArrangement)) {
      onChange(arrangement, lastArrangement);
      lastArrangement = arrangement;
    }
  };

  const listener = (): void => {
    action();
  };
  window.addEventListener('resize', listener);

  const observer = new MutationObserver(() => {
    action();
  });

  let parent: HTMLElement = container;

  // get the root container since elements not in the path upwards can affect layout of container
  for (; parent.parentElement; parent = parent.parentElement);

  observer.observe(parent, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  return () => {
    window.removeEventListener('resize', listener);
    observer.disconnect();
  };
}
