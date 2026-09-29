import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

let registered = false

export function registerGsap() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
  registered = true
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText }
