
{{#list}}
import {{this.name}}Act from '{{this.fullName}}';
{{/list}}

export default [
{{#list}}
    {
        name: '{{this.name}}',
        action :{{this.name}}Act
    },
{{/list}}
];
