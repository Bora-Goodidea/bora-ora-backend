import CodeRepository from '@Repositories/CodeRepository';
import RegionsRepository from '@Repositories/RegionsRepository';
import fs from 'fs';
import lodash from 'lodash';
import { ServiceResultInterface } from '@Types/CommonTypes';

/**
 * 공통 App Data
 * @constructor
 */
export const GenSystemData = async (): Promise<
    ServiceResultInterface<{
        code: {
            basic: Array<{
                type: string;
                group: string;
                code: string;
                name: string;
            }>;
            group: Array<{
                group: string;
                name: string;
                codes: Array<{
                    code: string;
                    name: string;
                }>;
            }>;
        };
        regions: {
            area: Array<{
                code: string;
                name: string;
            }>;
            basic: Array<{
                code: {
                    code: string;
                    name: string;
                };
                region: {
                    code: string;
                    name: string;
                };
            }>;
            group: Array<{
                code: string;
                name: string;
                region: Array<{
                    code: string;
                    name: string;
                }>;
            }>;
        };
    }>
> => {
    const codesTask = await CodeRepository.findAll();
    const regionsTask = await RegionsRepository.findAll();

    const groupCode = codesTask.filter((c) => c.type === `group`);
    const codeCode = codesTask.filter((c) => c.type === `code`);

    const basicCdoes = lodash.map(codesTask, (code) => {
        const { code_id, name, group_id, type } = code;
        return {
            type: type,
            group: group_id,
            code: code_id,
            name: name,
        };
    });

    const groupCdoes = lodash.map(groupCode, (g) => {
        return {
            group: g.group_id,
            name: g.name,
            codes: codeCode
                .filter((cf) => cf.group_id === g.group_id)
                .map((cfg) => {
                    return {
                        code: cfg.code_id,
                        name: cfg.name,
                    };
                }),
        };
    });

    const areaCode = lodash.filter(lodash.find(groupCdoes, { group: `090` })?.codes, (gc) => gc.code !== `090999`);

    const basicRegions = lodash.map(regionsTask, (r) => ({
        code: { code: `${r.r_code_id?.code_id}`, name: `${r.r_code_id?.name}` },
        region: { code: r.code, name: r.name },
    }));

    const groupRegions = lodash.map(areaCode, (ac) => {
        return {
            code: ac.code,
            name: ac.name,
            region: lodash.map(
                lodash.filter(regionsTask, (rt) => rt.code_id === ac.code),
                (r) => ({ code: r.code, name: r.name }),
            ),
        };
    });

    return {
        status: true,
        payload: {
            code: {
                basic: basicCdoes,
                group: groupCdoes,
            },
            regions: {
                area: areaCode,
                basic: basicRegions,
                group: groupRegions,
            },
        },
    };
};

/**
 * 시스템 공지 사항
 * @constructor
 */
export const SystemNotice = async (): Promise<boolean | string> => {
    try {
        const notice = fs.readFileSync('storage/system-notice.txt', 'utf8');
        if (notice.length > 1) {
            return notice.trim();
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};
