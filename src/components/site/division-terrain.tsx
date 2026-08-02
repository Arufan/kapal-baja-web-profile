type DivisionTerrainProps = {
  variant: "mountain" | "vertical";
};

export function DivisionTerrain({ variant }: DivisionTerrainProps) {
  if (variant === "vertical") {
    return (
      <svg
        className="division-terrain division-terrain--vertical"
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g className="division-terrain__contours">
          <path d="M448 -30C389 43 430 98 376 160C319 226 348 288 289 349C239 402 243 468 197 550" />
          <path d="M493 -28C429 49 476 110 415 177C354 244 388 306 325 371C270 427 278 484 229 552" />
          <path d="M543 -23C473 55 522 124 458 194C392 266 435 328 367 396C309 455 322 509 269 561" />
          <path d="M596 -18C520 65 573 139 505 213C434 289 484 353 412 424C348 487 369 533 311 574" />
        </g>
        <path className="division-terrain__face" d="M418 -20L392 70L417 114L369 183L386 234L324 302L340 363L273 430L255 545" />
        <path className="division-terrain__route" pathLength="1" d="M517 18C442 79 496 148 417 214C344 275 391 337 316 396C275 429 264 470 259 521" />
        <g className="division-terrain__holds">
          <circle cx="501" cy="68" r="7" />
          <circle cx="453" cy="133" r="9" />
          <circle cx="433" cy="204" r="6" />
          <circle cx="387" cy="270" r="10" />
          <circle cx="343" cy="347" r="7" />
          <circle cx="293" cy="425" r="9" />
        </g>
        <circle className="division-terrain__target" cx="259" cy="501" r="8" />
      </svg>
    );
  }

  return (
    <svg
      className="division-terrain division-terrain--mountain"
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="division-terrain__contours">
        <path d="M-42 408C38 332 80 349 142 283C201 219 239 255 290 187C335 128 373 144 409 92C454 27 527 35 679 -34" />
        <path d="M-32 448C53 370 98 388 163 319C225 254 263 291 318 219C366 156 405 172 445 116C493 48 561 59 689 -6" />
        <path d="M-21 489C70 409 116 428 185 357C250 289 291 328 347 252C398 187 439 206 482 147C533 76 594 91 698 26" />
        <path d="M-8 529C87 451 136 467 207 399C275 334 316 367 377 296C432 232 472 250 520 193C574 129 626 133 707 69" />
      </g>
      <path className="division-terrain__ridge" d="M-10 454L94 359L151 385L270 218L326 263L430 105L650 310L681 533H-10Z" />
      <path className="division-terrain__route" pathLength="1" d="M78 456C130 415 132 371 186 347C234 326 244 283 291 254C336 227 356 184 407 142" />
      <g className="division-terrain__waypoints">
        <circle cx="78" cy="456" r="6" />
        <circle cx="187" cy="347" r="6" />
        <circle cx="291" cy="254" r="6" />
      </g>
      <circle className="division-terrain__target" cx="407" cy="142" r="8" />
    </svg>
  );
}
