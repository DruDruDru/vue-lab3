Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true,
        }  
    },
    template: `
        <div class="column">
            <card v-for="card in cards"></card>
        </div>
    `
})

Vue.component('card', {
    template: `
        <p>Test card</p>
        <span>test</span>
    `
})

let app = new Vue({
    el: '#app',
    data: {
        cardsInPlan: ['first', 'second', 'third'],
        cardsInWork: ['first', 'second', 'third'],
        cardsInTest: ['first', 'second', 'third'],
        cardsInComplete: ['first', 'second', 'third'],
    }
})