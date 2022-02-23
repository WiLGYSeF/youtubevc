export function getFiberNode(node: Node): any {
  const fiberKey = Object.keys(node).find((k) => k.startsWith('__reactFiber$'));
  if (!fiberKey) {
    return null;
  }
  return (node as any)[fiberKey];
}

export function getFiberNodeName(node: Node): string | null {
  const fiber = getFiberNode(node);
  if (!fiber) {
    return null;
  }

  const component = fiber.return.elementType as Function;
  return component.name;
}
