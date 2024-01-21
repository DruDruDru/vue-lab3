
let eventBus = new Vue();

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
            ></card>
        </div>
    `,
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
            <div class="button-container">
                <input type="submit" @click="cardToDelete" value="Удалить" />
            </div>
        </div>
    `,
    methods: {
        cardToDelete() {
            eventBus.$emit('card-to-delete', this.card);
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
    },
    mounted() {
        eventBus.$on('card-to-delete', card => {
            index = this.cardsInPlan.findIndex(c => c.id === card.id)
            if (index !== -1) {
                this.cardsInPlan.splice(index, 1);
            }
        })
    },
})