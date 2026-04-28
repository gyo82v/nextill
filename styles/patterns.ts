//links, buttons, darkmode toggle
export const transitions =
  `transition-[background-color,color,border-color,box-shadow,transform,opacity]
   duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0
   motion-reduce:transform-none`;

//buttons
export const hoverPrimary =
  "hover:bg-[var(--primary-hover)] hover:text-[var(--primary-foreground)]";

//buttons, darkmode toggle
export const activePress =
  "active:scale-[0.98] active:translate-y-px active:shadow-none";

//cards
export const interactiveCard =
  `transition-[background-color,color,border-color,box-shadow,transform]
   duration-200 ease-out hover:bg-[var(--surface-2)] hover:shadow-sm active:scale-[0.99]
   active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none`;

//modals
export const overlay =
  "transition-opacity duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0";

//confirmations
export const modalPanel =
 `transition-[opacity,transform] duration-200 ease-out
  motion-reduce:transition-none motion-reduce:transform-none`;

//drawer panels, mobile navigation
export const drawerPanel =
  `transition-[transform,opacity] duration-200 ease-out
   motion-reduce:transition-none motion-reduce:transform-none`;

//no modal; hide/show content,languages toggle
export const disclosurePanel =
  `transition-[grid-template-rows,opacity,transform] duration-200 ease-out
   motion-reduce:transition-none motion-reduce:transform-none`;

// language toggle button
export const toggleButton = 
`transition-transform duration-200 ease-out motion-reduce:transition-none`