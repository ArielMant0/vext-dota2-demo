// Utilities
import * as d3 from 'd3';
import { defineStore } from 'pinia'
import { useVextState } from '@nullbuild/vext';

export const useApp = defineStore('app', {
    state: () => ({
        columns: [],
        heroes: [],
        roles: [],
        attributes: ["Strength", "Agility", "Intelligence", "Universal"],

        selected: null,
        highlightTeam: [],
        highlightEnemyTeam: [],

        useHighlight: false,
        highlightHeroes: [],

        scenario: { name: "Green vs. Blue", path: "scenarios/green-strat.json" },
        scenarioLoaded: false,
        SCENARIO_LIST: [
            { name: "Green vs. Blue", path: "scenarios/green-strat.json" },
        ],
        TEAMS: Object.freeze({
            NONE: 0,
            ME: 1,
            ENEMY: 2
        }),

        pos1: null,
        pos2: null,
        pos3: null,
        pos4: null,
        pos5: null,

        enemyPos1: null,
        enemyPos2: null,
        enemyPos3: null,
        enemyPos4: null,
        enemyPos5: null,
    }),

    getters: {

        heroesSTR: (state) => {
            return state.heroes.filter(d => d.primary_attr === "str")
        },
        heroesAGI: (state) => {
            return state.heroes.filter(d => d.primary_attr === "agi")
        },
        heroesINT: (state) => {
            return state.heroes.filter(d => d.primary_attr === "int")
        },
        heroesUNI: (state) => {
            return state.heroes.filter(d => d.primary_attr === "all")
        },

        colorSTR: () => "#ec3d06",
        colorAGI: () => "#26e030",
        colorINT: () => "#00d9ec",
        colorUNI: () => "#593dc8",

        teamColor: () => "#006600",
        enemyColor: () => "#660000",

        selectionInTeam: (state) => {
            if (!state.selected) return false;
            return state.team.some(d => d !== null && d.hero_id === state.selected.hero_id)
        },

        team: state => {
            return [state.pos1, state.pos2, state.pos3, state.pos4, state.pos5]
        },
        enemyTeam: state => {
            return [state.enemyPos1, state.enemyPos2, state.enemyPos3, state.enemyPos4, state.enemyPos5]
        },
        bothTeams: state => {
            const a = state.team.filter(d => d);
            const b = state.enemyTeam.filter(d => d);
            return a.concat(b)
        },
    },

    actions: {

        init() {
            const state = useVextState();
            state.on("load", this.loadState.bind(this));
            this.setState();
        },

        loadState(state) {
            this.scenario = state.scenario;
            this.pos1 = this.getHeroById(state.pos1);
            this.pos2 = this.getHeroById(state.pos2);
            this.pos3 = this.getHeroById(state.pos3);
            this.pos4 = this.getHeroById(state.pos4);
            this.pos5 = this.getHeroById(state.pos5);
            this.enemyPos1 = this.getHeroById(state.enemyPos1);
            this.enemyPos2 = this.getHeroById(state.enemyPos2);
            this.enemyPos3 = this.getHeroById(state.enemyPos3);
            this.enemyPos4 = this.getHeroById(state.enemyPos4);
            this.enemyPos5 = this.getHeroById(state.enemyPos5);
            this.selected = state.selected;
            this.useHighlight = false;
        },

        setState() {
            const state = useVextState();
            state.setData({
                scenario: this.scenario,
                pos1: this.pos1 ? this.pos1.hero_id : null,
                pos2: this.pos2 ? this.pos2.hero_id : null,
                pos3: this.pos3 ? this.pos3.hero_id : null,
                pos4: this.pos4 ? this.pos4.hero_id : null,
                pos5: this.pos5 ? this.pos5.hero_id : null,
                enemyPos1: this.enemyPos1 ? this.enemyPos1.hero_id : null,
                enemyPos2: this.enemyPos2 ? this.enemyPos2.hero_id : null,
                enemyPos3: this.enemyPos3 ? this.enemyPos3.hero_id : null,
                enemyPos4: this.enemyPos4 ? this.enemyPos4.hero_id : null,
                enemyPos5: this.enemyPos5 ? this.enemyPos5.hero_id : null,
                selected: this.selected,
            });
        },

        setColumns(cols) {
            this.columns = cols;
        },

        setHeroes(heroes) {
            this.heroes = heroes;
            this.heroes.forEach(d => d.team = this.TEAMS.NONE);
            const allroles = heroes.map(d => d.roles).flat().map(d => {
                return { value: d };
            });
            const roles = d3.group(allroles, d => d.value)
            this.roles = Array.from(roles.keys());
            this.setState();
        },

        setEnemyTeam(heroes) {
            const idByPos = pos => heroes.find(d => d.position === pos).hero_id
            this.enemyPos1 = this.heroes.find(d => d.hero_id == idByPos(1));
            this.enemyPos2 = this.heroes.find(d => d.hero_id == idByPos(2));
            this.enemyPos3 = this.heroes.find(d => d.hero_id == idByPos(3));
            this.enemyPos4 = this.heroes.find(d => d.hero_id == idByPos(4));
            this.enemyPos5 = this.heroes.find(d => d.hero_id == idByPos(5));
            this.enemyTeam.forEach(d => d.team = this.TEAMS.ENEMY);
            this.setState();
        },

        getHeroByName(name) {
            if (name === null) return null;
            return this.heroes.find(d => d.official_name === name);
        },

        getHeroById(id) {
            if (id === null) return null;
            return this.heroes.find(d => d.hero_id === id);
        },

        selectById(id) {
            if (!id || this.selected && this.selected.hero_id === id) {
                this.selected.team = this.TEAMS.NONE;
                this.selected = null;
            } else {
                this.selected = this.heroes.find(d => d.hero_id === id);
                this.selected.team = this.TEAMS.ME;
            }
            this.setState();
        },

        selectByName(name) {
            if (!name || this.selected && this.selected.official_name === name) {
                this.selected.team = this.TEAMS.NONE;
                this.selected = null;
            } else {
                this.selected = this.heroes.find(d => d.official_name === name);
                this.selected.team = this.TEAMS.ME;
            }
            this.setState();
        },

        isAvailable(hero) {
            return !this.isInTeam(hero) && !this.isInEnemyTeam(hero);
        },

        isInTeam(hero) {
            return hero && this.team.find(d => d && d.hero_id === hero.hero_id) !== undefined;
        },

        isInTeamById(id) {
            return this.team.find(d => d && d.hero_id === id) !== undefined;
        },

        isInTeamByName(name) {
            return this.team.find(d => d && d.official_name === name) !== undefined;
        },

        isInEnemyTeam(hero) {
            return hero && this.enemyTeam.find(d => d && d.hero_id === hero.hero_id) !== undefined;
        },

        isInEnemyTeamById(id) {
            return this.enemyTeam.find(d => d && d.hero_id === id) !== undefined;
        },

        isInEnemyTeamByName(name) {
            return this.enemyTeam.find(d => d && d.official_name === name) !== undefined;
        },

        isSelected(hero) {
            return this.selected && hero && this.selected.hero_id === hero.hero_id;
        },

        setPositionToSelected(position) {
            switch(position) {
                case 2:
                    this.pos2 = this.selected;
                    break;
                case 3:
                    this.pos3 = this.selected;
                    break;
                case 4:
                    this.pos4 = this.selected;
                    break;
                case 5:
                    this.pos5 = this.selected;
                    break;
                case 1:
                default:
                    this.pos1 = this.selected;
                    break;
            }
            this.resetPositionIfDuplicate(this.selected.hero_id, position);
            this.selected = null;
            this.setState();
        },

        resetPosition(position) {
            switch(position) {
                case 2:
                    this.pos2 = null;
                    break;
                case 3:
                    this.pos3 = null;
                    break;
                case 4:
                    this.pos4 = null;
                    break;
                case 5:
                    this.pos5 = null;
                    break;
                case 1:
                default:
                    this.pos1 = null;
                    break;
            }
            this.setState();
        },

        resetPositionIfDuplicate(id, ignore) {
            if (ignore !== 1 && this.pos1 && this.pos1.hero_id === id) {
                this.pos1 = null;
            }
            if (ignore !== 2 && this.pos2 && this.pos2.hero_id === id) {
                this.pos2 = null;
            }
            if (ignore !== 3 && this.pos3 && this.pos3.hero_id === id) {
                this.pos3 = null;
            }
            if (ignore !== 4 && this.pos4 && this.pos4.hero_id === id) {
                this.pos4 = null;
            }
            if (ignore !== 5 && this.pos5 && this.pos5.hero_id === id) {
                this.pos5 = null;
            }
        },

        isTeamHighlighted(hero, team=null) {
            if (!hero) return false;
            team = team === null ? hero.team : team;
            if (team === this.TEAMS.ENEMY) {
                return this.highlightEnemyTeam.find(d => d.hero_id === hero.hero_id) !== undefined;
            } else {
                return this.highlightTeam.find(d => d.hero_id === hero.hero_id) !== undefined;
            }
        },

        highlightTeamBy(func, team=null) {
            if (team === this.TEAMS.ENEMY) {
                this.highlightEnemyTeam = this.enemyTeam.filter(d => d && func(d))
            } else {
                this.highlightTeam = this.team.filter(d => d && func(d))
            }
            this.setState();
        },

        resetTeamHighlight(team=null) {
            if (team === this.TEAMS.ENEMY) {
                this.highlightEnemyTeam = [];
            } else {
                this.highlightTeam = [];
            }
            this.setState();
        },

        isHeroHighlighted(hero) {
            if (!this.useHighlight) return true;
            if (!hero || (this.useHighlight && this.highlightHeroes.length === 0)) return false;
            return this.highlightHeroes.find(d => d.hero_id === hero.hero_id) !== undefined;
        },

        highlightHeroBy(func) {
            this.highlightHeroes = this.heroes.filter(func)
            this.useHighlight = true;
            this.setState();
        },

        resetHeroHighlight() {
            this.highlightHeroes = [];
            this.useHighlight = false;
            this.setState();
        }
    }
})
