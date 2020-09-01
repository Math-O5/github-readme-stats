const {
    kFormatter,
    getCardColors,
    FlexLayout,
    encodeHTML,
  } = require("../common/utils");
  const { getStyles } = require("../getStyles");
  const icons = require("../common/icons");
  const Card = require("../common/Card");
  
  const createTextNode = ({
    icon,
    label,
    value,
    id,
    index,
    showIcons,
    shiftValuePos,
  }) => {
    const kValue = kFormatter(value);
    const staggerDelay = (index + 3) * 150;
  
    const labelOffset = showIcons ? `x="25"` : "";
    const iconSvg = showIcons
      ? `
      <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
        ${icon}
      </svg>
    `
      : "";
    return `
      <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
        ${iconSvg}
        <text class="stat bold" ${labelOffset} y="12.5">${label}:</text>
        <text 
          class="stat" 
          x="${shiftValuePos ? (showIcons ? 200 : 170) : 150}" 
          y="12.5" 
          data-testid="${id}"
        >${kValue}</text>
      </g>
    `;
  };
  const renderStackOverFlowCard = (stack = {}, options = { hide: [] }) => {
    console.log("teste");
    const {
      name,
      reputation,
      totalGoldBagdes,
      totalSilverBagdes,
      totalBronzeBagdes,
    } = stack;
    const {
      hide = [],
      show_icons = false,
      hide_title = false,
      hide_border = false,
      hide_rank = false,
      include_all_commits = false,
      line_height = 25,
      title_color,
      icon_color,
      text_color,
      bg_color,
      theme = "default",
    } = options;
    const lheight = parseInt(line_height, 10);

    // returns theme based colors with proper overrides and defaults
    const { titleColor, textColor, iconColor, bgColor } = getCardColors({
      title_color,
      icon_color,
      text_color,
      bg_color,
      theme,
    });

    const STACK = {
        "reputation": {
            icon: icons.star,
            label: "Total Bagde Gold",
            value: reputation,
            id: "o",
        },
        "totalGoldBagdes": {
            icon: icons.star,
            label: "Total Bagde Gold",
            value: totalGoldBagdes,
            id: "totalGoldBagdes",
        },
        "totalSilverBagdes": {
            icon: icons.star,
            label: "Total Badge Silver",
            value: totalSilverBagdes,
            id: "totalSilverBagdes",
        },
        "totalBronzeBagdes": {
            icon: icons.star,
            label: "Total Bagde Bronze",
            value: totalBronzeBagdes,
            id: "totalBronzeBagdes",
        },
    }

    // filter out hidden stacks defined by user & create the text nodes
    const stackItems = Object.keys(STACK)
        .filter((key) => !hide.includes(key))
        .map((key, index) =>
            // create the text nodes, and pass index so that we can calculate the line spacing
            createTextNode({
                ...STACK[key],
                index,
                showIcons: show_icons,
                shiftValuePos: !include_all_commits,
            })
        );

    // Calculate the card height depending on how many items there are
    // but if rank circle is visible clamp the minimum height to `150`
    let height = Math.max(
        45 + (stackItems.length + 1) * lheight,
        hide_rank ? 0 : 150
    );

    const cssStyles = getStyles({
        titleColor,
        textColor,
        iconColor,
        show_icons,
        progress,
      });
    
    const apostrophe = ["x", "s"].includes(name.slice(-1)) ? "" : "s";
    const card = new Card({
        title: `${encodeHTML(name)}'${apostrophe} StackOverlow Metric`,
        width: 495,
        height,
        colors: {
            titleColor,
            textColor,
            iconColor,
            bgColor,
        },
    });

    card.setHideBorder(hide_border);
    card.setHideTitle(hide_title);
    card.setCSS(cssStyles);

    return card.render(`
    <svg x="0" y="0">
        ${FlexLayout({
        items: stackItems,
        gap: lheight,
        direction: "column",
        }).join("")}
    </svg> 
    `);
}

module.exports = renderStackOverFlowCard;
