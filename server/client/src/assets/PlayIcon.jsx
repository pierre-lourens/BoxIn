// import * as React from "react";

// function PlayIcon(props) {
//   return (
//     <svg fill='none' viewBox='0 0 24 24' stroke='currentColor' {...props}>
//       <path
//         strokeLinecap='round'
//         strokeLinejoin='round'
//         strokeWidth={2}
//         d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
//       />
//       <path
//         strokeLinecap='round'
//         strokeLinejoin='round'
//         strokeWidth={2}
//         d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
//       />
//     </svg>
//   );
// }

// export default PlayIcon;

import * as React from "react";

function PlayIcon(props) {
  return (
    <svg viewBox='0 0 20 20' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
        clipRule='evenodd'
      />
    </svg>
  );
}

export default PlayIcon;
