<template> 
    <section id="ei-newslatter" class="ei-newslatter-section position-relative">
        <div class="ei-newslatter-box position-relative">
            <div class="container">
                 <h1 class="white-text" style="color:#fff;">Investors</h1>
                <div class="d-flex flex-row flex-wrap">
                    <div>
                        <a href="#" @click.prevent v-for="(icon,index) in investors" :key="index" class="investor">
                            <img :src="'/assets/app/investors/'+icon" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="ei-news-vector1 position-absolute"><img src="assets/img/app-landing/shape/n-shape1.png" alt=""></div>
            <div class="ei-news-vector2 position-absolute"><img src="assets/img/app-landing/shape/n-shape2.png" alt=""></div>
            <div class="ei-news-vector3 position-absolute" data-parallax="{&quot;x&quot; : 50}" style="transform:translate3d(18.604px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1); -webkit-transform:translate3d(18.604px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1); "><img src="assets/img/app-landing/shape/n-shape3.png" alt=""></div>
        </div>
     
    </section>
</template>

<script>
export default {
    data(){return {
        investors: [
            "auth21.svg",
            "axia8.svg",
            "icetea.svg",
            "krypital.svg",
            "polygon.svg",
            "dd.svg",
            "hg.svg",
            "dfyn.svg",
            "ld.svg",
            "router.svg",
            "orion.svg"
        ]
    }}
}
</script>

<style>
    .investor{
        margin-left:0px; padding-top: 20px; margin-bottom: 10px;
        margin-right: 20px;
        display: inline-block;
    }
</style>