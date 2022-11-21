/** Expect includes @ sign */
export const parseUserHostAndItem = (params: {
  user: string;
  hostAndItem: string;
}) => {
  const [hostPart, ...item] = params.hostAndItem.split("/");

  let toLabel = `${params.user}${hostPart}`;
  let originServerHref = `https://${hostPart}/${params.user}`;
  if(item.length) {
    const itemPart = `/${item.join("/")}`;
    toLabel += itemPart;
    originServerHref += itemPart;
  }

  return {
    originServerHref,
    toLabel,
    originHost: hostPart.slice(1),
  };
};
