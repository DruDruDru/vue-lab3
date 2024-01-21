
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
    data() {
        return {
            clickOnAdd: false,
        }
    },
    template: `
        <div class="column">
            <card 
                v-for="card in cards"
                :card="card"
                :key="card.id"
            ></card>
            <button 
                @click="onClick" 
                v-show="!clickOnAdd"
                v-if="addable"
            >Добавить</button>
            <add-card 
                v-if="addable"
                @on-submit-for-create-form="onClick"
                v-show="clickOnAdd"
            ></add-card>
        </div>
    `,
    methods: {
        onClick() {
            if (this.clickOnAdd) this.clickOnAdd = false;
            else this.clickOnAdd = true;
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
        <div>
            <div class="card" v-show="!click">
                <p>{{ card.dateOfCreate }}</p>
                <p>{{ card.title }}</p>
                <p class="desciption">{{ card.description }}</p>
                <p>Дэдлайн: {{ fullDate }}</p>
                <div class="button-container">
                    <input type="submit" @click="cardToEdit" value="Редактировать" />
                    <input type="submit" @click="cardToDelete" value="Удалить" />
                </div>
            </div>
            
            <form @submit.prevent="onSubmit" v-show="click" class="update">
                <p>
                    <label for="title">Заголовок:</label>
                    <input type="text" required maxlength=25 v-model="card.title" id="title" />
                </p>
                <p>
                    <label for="description">Описание:</label>
                    <textarea required id="description" maxlength=100 v-model="card.description"></textarea>
                </p>
                <p>
                    <label for="deadline">Дедлайн:</label></br>
                    <input type="date" required id="deadline" v-model="card.deadline" />
                    <input type="time" required id="deadline" v-model="card.time" />
                </p>
                <p>
                    <input type="submit" value="Сохранить" />
                </p>
            </form>
        </div>
    `,
    data() {
        return {
            click: false,
        }
    },
    computed: {
        fullDate() {
            return new Date(this.card.deadline + 'T' + this.card.time)      
        }
    },
    methods: {
        onSubmit() {
            this.click=false
        },
        cardToDelete() {
            eventBus.$emit('card-to-delete', this.card);
        },
        cardToEdit() {
            this.click = true;
        }
    },
})

Vue.component('add-card', {
    template: `
        <form @submit.prevent="onSubmit" class="add-card">
            <p>
                <label for="title">Заголовок:</label>
                <input type="text" required maxlength=25 v-model="title" id="title" />
            </p>
            <p>
                <label for="description">Описание:</label>
                <textarea required id="description" maxlength=255 v-model="description"></textarea>
            </p>
            <p>
                <label for="deadline">Дедлайн:</label></br>
                <input type="date" required id="deadline" v-model="deadline" />
                <input type="time" required id="deadline" v-model="time" />
            </p>
            <p>
                <input type="submit" value="Сохранить" />
            </p>
        </form>
    `,
    data() {
        return {
            dateOfCreate: null,
            title: null,
            description: null,
            deadline: null,
            time: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                dateOfCreate: new Date(),
                title: this.title,
                description: this.description,
                deadline: String(this.deadline),
                time: String(this.time)
            }
            eventBus.$emit('on-submit', card)
            this.dateOfCreate = null
            this.title = null,
            this.description = null,
            this.deadline = null
            this.$emit('on-submit-for-create-form')
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
                deadline: '2222-02-22',
                time: '12:22:00'
            },
            {
                id: 1,
                dateOfCreate: new Date(),
                title: 'Сделать лабуi',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: '2222-02-22',
                time: '12:22:00'
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
