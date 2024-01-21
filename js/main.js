
let eventBus = new Vue();

Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true,
        },
        addable: {
            type: Boolean,
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
            <button @click="onClick" v-show="!click" v-if="addable">Добавить</button>
            <add-card 
                v-show="click"
                @on-submit-for-click="onClick"
            ></add-card>
        </div>
    `,
    data() {
        return {
            click: false,
        }
    },
    methods: {
        onClick() {
            if (this.click) this.click = false
            else this.click = true
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
            <div class="button-container">
                <input type="submit" @click="cardToDelete" value="Удалить" />
            </div>
        </div>
    `,
    methods: {
        cardToDelete() {
            eventBus.$emit('card-to-delete', this.card);
        },
    }
})

Vue.component('add-card', {
    template: `
        <form @submit.prevent="onSubmit">
            <p>
                <label for="title">Заголовок:</label>
                <input type="text" required maxlength=25 v-model="title" id="title" />
            </p>
            <p>
                <label for="description">Описание:</label>
                <textarea required id="description" maxlength=255 v-model="description"></textarea>
            </p>
            <p>
                <label for="deadline">Дедлайн:</label>
                <input type="date" required id="deadline" v-model="deadline" />
            </p>
            <p>
                <input type="submit" value="Отправить" />
            </p>
        </form>
    `,
    data() {
        return {
            dateOfCreate: null,
            title: null,
            description: null,
            deadline: null,
            click: false
        }
    },
    methods: {
        onSubmit() {
            let card = {
                dateOfCreate: new Date(),
                title: this.title,
                description: this.description,
                deadline: this.deadline
            }
            eventBus.$emit('on-submit', card)
            this.dateOfCreate = null
            this.title = null,
            this.description = null,
            this.deadline = null
            this.$emit('on-submit-for-click')
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
        }),
        eventBus.$on('on-submit', card => {
            this.cardsInPlan.push(card)
        })
    },
})
