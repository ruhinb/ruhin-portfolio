// Runs before the page draws. On the first visit in a browser session it notes that
// the loader has played; on later visits it adds `intro-seen` to <html>, which hides
// the loader and brings the hero in straight away.
const script = `try{var s=window.sessionStorage;if(s.getItem('ru_intro_seen')==='1'){document.documentElement.classList.add('intro-seen')}else{s.setItem('ru_intro_seen','1')}}catch(e){}`;

export function IntroScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
