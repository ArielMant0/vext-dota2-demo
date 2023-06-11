// Utilities
import * as d3 from 'd3';
import { defineStore } from 'pinia'

export const useApp = defineStore('app', {
    state: () => ({
        columns: [],
        heroes: [],
        roles: [],
        attributes: ["Strength", "Agility", "Intelligence", "Universal"],

        selected: null,
        highlightTeam: [],

        useHighlight: false,
        highlightHeroes: [],

        pos1: null,
        pos2: null,
        pos3: null,
        pos4: null,
        pos5: null,
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
        opponentColor: () => "#660000",

        selectionInTeam: (state) => {
            if (!state.selected) return false;
            return state.team.some(d => d !== null && d.hero_id === state.selected.hero_id)
        },

        team: (state) => {
            return [state.pos1, state.pos2, state.pos3, state.pos4, state.pos5]
        }
    },

    actions: {

        setColumns(cols) {
            this.columns = cols;
        },

        setHeroes(heroes) {
            this.heroes = heroes;
            const allroles = heroes.map(d => d.roles).flat().map(d => {
                return { value: d };
            });
            const roles = d3.group(allroles, d => d.value)
            this.roles = Array.from(roles.keys());
        },

        getHeroByName(name) {
            return this.heroes.find(d => d.official_name === name);
        },

        selectById(id) {
            if (!id || this.selected && this.selected.hero_id === id) {
                this.selected = null;
            } else {
                this.selected = this.heroes.find(d => d.hero_id === id);
            }
        },

        selectByName(name) {
            if (!name || this.selected && this.selected.official_name === name) {
                this.selected = null;
            } else {
                this.selected = this.heroes.find(d => d.official_name === name);
            }
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

        isTeamHighlighted(hero) {
            if (!hero || this.highlightTeam.length === 0) return false;
            return this.highlightTeam.find(d => d.hero_id === hero.hero_id) !== undefined;
        },

        highlightTeamBy(func) {
            this.highlightTeam = this.team.filter(d => d !== null && func(d))
        },

        resetTeamHighlight() {
            this.highlightTeam = [];
        },

        isHeroHighlighted(hero) {
            if (!this.useHighlight) return true;
            if (!hero || (this.useHighlight && this.highlightHeroes.length === 0)) return false;
            return this.highlightHeroes.find(d => d.hero_id === hero.hero_id) !== undefined;
        },

        highlightHeroBy(func) {
            this.highlightHeroes = this.heroes.filter(func)
            this.useHighlight = true;
        },

        resetHeroHighlight() {
            this.highlightHeroes = [];
            this.useHighlight = false;
        }
    }
})
