
import AccisdentAct from './alarm/Accisdent';
import AlarmAct from './alarm/Alarm';
import CodeCreatorAct from './code/CodeCreator';
import CodeEditorAct from './code/CodeEditor';
import EntityFieldAct from './code/EntityField';
import EntityManagerAct from './code/EntityManager';
import ModelAct from './code/Model';
import ModuleEditorAct from './code/ModuleEditor';
import EventAct from './event/Event';
import NoticeAct from './notice/Notice';
import ServerAct from './server/Server';
import ServerGroupAct from './server/ServerGroup';
import AppAct from './system/App';
import DictAct from './system/Dict';
import ExternalPageAct from './system/ExternalPage';
import LoginAct from './system/Login';
import MenuAct from './system/Menu';
import OrgAct from './tenant/Org';
import RightAct from './tenant/Right';
import RoleAct from './tenant/Role';
import TenantAct from './tenant/Tenant';
import UserAct from './user/User';

export default [
    {
        name: 'Accisdent',
        action :AccisdentAct
    },
    {
        name: 'Alarm',
        action :AlarmAct
    },
    {
        name: 'CodeCreator',
        action :CodeCreatorAct
    },
    {
        name: 'CodeEditor',
        action :CodeEditorAct
    },
    {
        name: 'EntityField',
        action :EntityFieldAct
    },
    {
        name: 'EntityManager',
        action :EntityManagerAct
    },
    {
        name: 'Model',
        action :ModelAct
    },
    {
        name: 'ModuleEditor',
        action :ModuleEditorAct
    },
    {
        name: 'Event',
        action :EventAct
    },
    {
        name: 'Notice',
        action :NoticeAct
    },
    {
        name: 'Server',
        action :ServerAct
    },
    {
        name: 'ServerGroup',
        action :ServerGroupAct
    },
    {
        name: 'App',
        action :AppAct
    },
    {
        name: 'Dict',
        action :DictAct
    },
    {
        name: 'ExternalPage',
        action :ExternalPageAct
    },
    {
        name: 'Login',
        action :LoginAct
    },
    {
        name: 'Menu',
        action :MenuAct
    },
    {
        name: 'Org',
        action :OrgAct
    },
    {
        name: 'Right',
        action :RightAct
    },
    {
        name: 'Role',
        action :RoleAct
    },
    {
        name: 'Tenant',
        action :TenantAct
    },
    {
        name: 'User',
        action :UserAct
    },
];
