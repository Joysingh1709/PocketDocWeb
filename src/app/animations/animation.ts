import { trigger, state, animate, transition, animation, style } from '@angular/animations';


export function fadeIn() {
    return trigger('fadeIn', [

        // the "in" style determines the "resting" state of the element when it is visible.
        //   state('in', style({opacity: 0})),

        // fade in when created. this could also be written as transition('void => *')
        transition('void => *', [
            style({ opacity: 0 }),
            animate(500, style({ opacity: 1 }))
        ]),

        //   // fade out when destroyed. this could also be written as transition('void => *')
        //   transition(':leave',
        //     animate(200, style({opacity: 0})))

    ]);
}

// export function shrinkOut (){
//   return trigger('shrinkOut', [
//     state('out', style({ transform: "translateY(0px)" })),
//     transition('* => out', [
//       style({ transform: "translateY(1000px)" }),
//       animate("1000s ease", style({ height: 0 }))
//     ])
//   ])
// }

export const slideInOutAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('slideInOutAnimation', [

        // end state styles for route container (host)
        state('*', style({
            // the view covers the whole screen with a semi tranparent background
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.8)'
        })),

        // route 'enter' transition
        transition(':enter', [

            // styles at start of transition
            style({
                // start with the content positioned off the right of the screen, 
                // -400% is required instead of -100% because the negative position adds to the width of the element
                right: '-400%',

                // start with background opacity set to 0 (invisible)
                // backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to 0 which slides the content into view
                right: 0,

                // transition the background opacity to 0.8 to fade it in
                // backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }))
        ]),

        // route 'leave' transition
        transition(':leave', [
            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to -400% which slides the content out of view
                right: '-400%',

                // transition the background opacity to 0 to fade it out
                // backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);



export function chatAnime() {
    return trigger('chatAnime', [
        transition('void => *', [
            style({ transform: 'scale3d(.3, .33, .3)' }),
            animate(100)
        ]),
        transition('* => void', [
            animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
    ])
}

export function chatWin() {
    return trigger('chatWin', [
        state('void', style({
            // transform: 'translateY(100%)',
            opacity: 0
        })),
        transition(':enter', [
            style({
                transform: 'scale3d(.3, .33, .3)',
                // transform: 'translateY(0)',
                opacity: 1
            }),
            animate(100)
        ]),
        transition(':leave', [
            animate(100, style({
                transform: 'scale3d(.0, .0, .0)',
                // transform: 'translateY(100%)',
                opacity: 0
            }))
        ])
    ])
}


export function chatBodyAnime() {
    return trigger('chatBodyAnime', [
        state('void', style({
            opacity: 0
        }))
    ]);
}

export function exapnButton() {
    return trigger('exapnButton', [
        state('open', style({
            width: '300px',
            overflow: 'hidden',
            border: '1px #147EFB solid'
        })),
        state('close', style({
            width: '24px',
            overflow: 'hidden',
            border: '1px transparent solid'
        })),
        transition('open => close', animate('500ms ease-in-out')),
        transition('close => open', animate('500ms ease-in-out'))
    ]);
}

export function winComeGo() {
    return trigger('winComeGo', [
        transition(':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),  // initial
            animate('0.5s',
                style({ transform: 'translateY(0)', opacity: 1 }))  // final
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0)', opacity: 1 }),  // initial
            animate('1s',
                style({ transform: 'translateY(100%)', opacity: 0 }))  // final
        ])
    ])
}