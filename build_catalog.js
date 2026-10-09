const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

const catalog = sections.map(sec => {
  return {
    index: sec.index,
    id: sec.id,
    type: sec.type,
    name: sec.custom?.name || sec.displayName || sec.id,
    bg: sec.props?.backgroundColor || sec.props?.backgroundImage,
    height: sec.props?.height,
    children: (sec.children || []).map(c => {
      return {
        id: c.id,
        type: c.type,
        left: c.props?.left,
        top: c.props?.top,
        width: c.props?.width,
        height: c.props?.height,
        src: c.props?.src,
        text: c.props?.text,
        title: c.props?.title,
        color: c.props?.color || c.props?.textColor,
        fontSize: c.props?.fontSize,
        fontFamily: c.props?.fontFamily,
        textAlign: c.props?.textAlign,
        fontWeight: c.props?.fontWeight,
        lineHeight: c.props?.lineHeight,
        props: c.props,
        children: c.children
      };
    })
  };
});

fs.writeFileSync('catalog.json', JSON.stringify(catalog, null, 2));
console.log('Catalog generated, total sections:', catalog.length);
