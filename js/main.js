
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
            <div class="card" v-show="!click" :id="card.id">
                <div class="button-container">
                    <button @click="cardToPrev" class="prevButton"><</button>
                    <button @click="cardToNext" class="nextButton">></button>
                </div>
                <form @submit.prevent="onPrevSubmit" v-show="clickOnPrev" class="reason-form">
                    <input type="text" maxlength=50 v-model="card.reason" />
                    <input type="submit" value="Отправить" />
                </form>
                <p><strong>Время создания:</strong> {{ card.dateOfCreate }}</p>
                <p><strong>Название:</strong> {{ card.title }}</p>
                <p v-if="card.lastUpdate"><strong>Дата последнего обновления:</strong> {{ card.lastUpdate }}</p>
                <p class="desciption"><strong>Описание:</strong> {{ card.description }}</p>
                <p><strong>Дэдлайн:</strong> {{ fullDate }}</p>
                <p v-if="card.reason"><strong>Причина возврата: </strong>{{ card.reason }}</p>
                <p v-if="card.dateAnswer"><strong>Статус: </strong>{{ card.dateAnswer }}</p>
                <div class="button-container">
                    <input type="submit" @click="cardToEdit" value="Редактировать" />
                    <input type="submit" @click="cardToDelete" value="Удалить" class="deleteButton" />
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
            clickOnPrev: false,
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
            this.card.lastUpdate = new Date();
        },
        onPrevSubmit() {
            this.clickOnPrev = false
            if (this.card.reason) {
                eventBus.$emit('card-to-prev', this.card);
            }
        },
        cardToDelete() {
            eventBus.$emit('card-to-delete', this.card);
        },
        cardToNext() {
            eventBus.$emit('card-to-next', this.card);
        },
        cardToPrev() {
            this.clickOnPrev = true
        },
        cardToEdit() {
            this.click = true;
        },
    }
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
                <input type="date" required id="deadline" maxlength=8 v-model="deadline" />
                <input type="time" required id="deadline" v-model="time" />
            </p>
            <p>
                <input type="submit" value="Сохранить" />
            </p>
        </form>
    `,
    data() {
        return {
            id: 3,
            dateOfCreate: null,
            title: null,
            description: null,
            deadline: null,
            time: null,
            lastUpdate: null,
            dateAnswer: null,
            reason: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                id: ++this.id,
                dateOfCreate: new Date(),
                title: this.title,
                description: this.description,
                deadline: String(this.deadline),
                time: String(this.time),
                lastUpdate: this.lastUpdate,
                dateAnswer: this.dateAnswer,
                reason: this.reason,
            }
            eventBus.$emit('on-submit', card)
            this.dateOfCreate = null
            this.title = null
            this.description = null
            this.deadline = null
            this.time = null
            this.lastUpdate = null
            this.dateAnswer = null
            this.reason = null,
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
                time: '12:22:00',
                lastUpdate: null,
                dateAnswer: null,
                reason: null,
            },
        ],
        cardsInWork: [
            {
                id: 1,
                dateOfCreate: new Date(),
                title: 'Сделать лабуi',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: '2222-02-22',
                time: '12:22:00',
                lastUpdate: null,
                dateAnswer: null,
                reason: null,
            },
        ],
        cardsInTest: [
            {
                id: 2,
                dateOfCreate: new Date(),
                title: 'Сделать лабуi',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: '2222-02-22',
                time: '12:22:00',
                lastUpdate: null,
                dateAnswer: null,
                reason: null,
            },
        ],
        cardsInComplete: [
            {
                id: 3,
                dateOfCreate: new Date(),
                title: 'Сделать лабуi',
                description: 'Нужно сделать лабороторную работу на Vue.js',
                deadline: '2222-02-22',
                time: '12:22:00',
                lastUpdate: null,
                dateAnswer: 'Успел',
                reason: null,
            },
        ],
    },
    mounted() {
        eventBus.$on('card-to-delete', card => {
            let index = this.cardsInPlan.indexOf(card)
            if (index !== -1) {
                this.cardsInPlan.splice(index, 1);
            }
        }),
        eventBus.$on('on-submit', card => {
            this.cardsInPlan.push(card)
        }),
        eventBus.$on('card-to-next', card => {
            if (this.cardsInPlan.indexOf(card) !== -1) {
                this.cardsInPlan.splice(this.cardsInPlan.indexOf(card), 1)
                this.cardsInWork.push(card)
            } else if (this.cardsInWork.indexOf(card) !== -1) {
                this.cardsInWork.splice(this.cardsInWork.indexOf(card), 1)
                this.cardsInTest.push(card)
            } else if (this.cardsInTest.indexOf(card) !== -1) {
                this.cardsInTest.splice(this.cardsInTest.indexOf(card), 1)
                this.cardsInComplete.push(card)
                let deadline = new Date(card.deadline + 'T' + card.time) 
                if (new Date() > deadline) {
                    card.dateAnswer = 'Просрочен'
                } else {
                    card.dateAnswer = 'Успел'
                }
            }
        })
        eventBus.$on('card-to-prev', card => {
            if (this.cardsInTest.indexOf(card) !== -1) {
                this.cardsInTest.splice(this.cardsInTest.indexOf(card), 1)
                this.cardsInWork.push(card)
            }
        })
    },
})
