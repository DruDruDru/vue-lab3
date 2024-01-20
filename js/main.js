Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true,
        }  
    },
    template: `
        <div class="column">
            <card 
                v-for="card in cards"
                :card="card"
                :key="card.id"
                @card-to-delete="deleteCard"
            ></card>
        </div>
    `,
    methods: {
        deleteCard(card) {
            idx = this.cards.indexOf(card)
            this.cards = this.cards.filter((value, index) => index !== idx)
        }
    }
})

Vue.component('card', {
    props: {
        card: {
            type: Object,
            required: true,
        }
    },
    template: `
        <div class="card">
            <p>{{ card.dateOfCreate }}</p>
            <p>{{ card.title }}</p>
            <p>{{ card.description }}</p>
            <p>{{ card.deadline }}</p>
            <div>
                <input type="submit" @click="cardToDelete(card)" value="X" />
            </div>
        </div>
    `,
    methods: {
        cardToDelete(card) {
            this.$emit('card-to-delete', card);
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        cardsInPlan: [
            {
                id: 0,
                dateOfCreate: new Date(),
                title: 'Сделать лабу',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: new Date(),
            },
            {
                id: 1,
                dateOfCreate: new Date(),
                title: 'Сделать лабуi',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: new Date(),
            },
        ],
        cardsInWork: [],
        cardsInTest: [],
        cardsInComplete: [],
    }
})