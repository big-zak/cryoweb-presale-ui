<template>
   <main class="main">
     
     <Header />
     <HeaderHero />
     <PresaleSection id="presale" />
     <Features id="features" />
     <Roadmap id="roadmap" />
     <Team id="team" />
     <FAQ id="faq" />
     <Footer />
  </main>
</template>

<script>

import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import PresaleSection from '../components/PresaleSection.vue';
import HeaderHero from "../components/HeaderHero.vue";
import FAQ from "../components/FAQ.vue";
import Features from "../components/Features.vue";
//import Features2 from "../components/Features2.vue";
//import Roadmap from "../components/Roadmap.vue";
//import Investors from "../components/Investors.vue";

// FAQ, Features, Features2, Roadmap, Investors, Footer

import Team from "../components/Team.vue";

export default {
  components: {Header, PresaleSection, HeaderHero, Features, Team, FAQ, Footer },

  mounted(){
    import("../../public/js/app.js")
  }
}
</script>
